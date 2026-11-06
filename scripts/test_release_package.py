"""Focused release archive checks using isolated ZIP fixtures."""

import json
import os
import subprocess
import tempfile
import unittest
import zipfile
from pathlib import Path

from release_package import REQUIRED, create, validate


class ReleasePackageTest(unittest.TestCase):
    """Exercise complete, unsafe and incomplete Composer archives."""

    def setUp(self):
        """Create an independent temporary archive path."""
        self.directory = tempfile.TemporaryDirectory()
        self.addCleanup(self.directory.cleanup)
        self.archive = Path(self.directory.name) / "release.zip"
        self.files = {name: b"{}" for name in REQUIRED}
        self.files.update({
            "assets/dist/main.css": b".example { color: red }",
            "assets/dist/main.js": b"console.log('ok')",
            "assets/dist/manifest.json": json.dumps({
                "css/styleguide-css.css": "main.css",
                "js/styleguide-js.js": "main.js",
            }).encode(),
        })

    def write_archive(self):
        """Write the selected fixture files into a ZIP."""
        with zipfile.ZipFile(self.archive, "w") as archive:
            for name, content in self.files.items():
                archive.writestr(name, content)

    def test_accepts_complete_root_layout(self):
        """Accept complete payloads with resolved manifest references."""
        self.write_archive()
        validate(self.archive)

    def test_rejects_missing_manifest_asset(self):
        """Reject a manifest pointing outside the packaged build."""
        del self.files["assets/dist/main.js"]
        self.write_archive()
        with self.assertRaisesRegex(ValueError, "Missing manifest asset"):
            validate(self.archive)

    def test_rejects_unresolved_vendor_url(self):
        """Prevent dependencies from leaking into generated CSS URLs."""
        self.files["assets/dist/main.css"] = b"@font-face { src: url(../vendor/font.woff2) }"
        self.write_archive()
        with self.assertRaisesRegex(ValueError, "Unresolved vendor URL"):
            validate(self.archive)

    def test_rejects_forbidden_files(self):
        """Never include Composer dependencies in the release payload."""
        self.files["vendor/autoload.php"] = b""
        self.write_archive()
        with self.assertRaisesRegex(ValueError, "forbidden"):
            validate(self.archive)

    def test_rejects_missing_runtime_token_data(self):
        """Require both runtime design token sources."""
        del self.files["source/data/design-tokens.json"]
        self.write_archive()
        with self.assertRaisesRegex(ValueError, "Missing required"):
            validate(self.archive)

    def test_create_includes_generated_assets_but_not_untracked_source(self):
        """Package tracked source and generated build output, not workspace debris."""
        root = Path(self.directory.name) / "checkout"
        root.mkdir()
        for name, content in self.files.items():
            path = root / name
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_bytes(content)
        subprocess.run(["git", "init", "-q", str(root)], check=True)
        subprocess.run(["git", "-C", str(root), "add", "assets", "source", *sorted(REQUIRED & set(self.files))],
                       check=True)
        (root / "source" / ".env").write_text("private")
        (root / "assets" / "dist" / "main.js").unlink()
        (root / "assets" / "dist" / "main.js").write_text("built")

        create(root, self.archive)

        with zipfile.ZipFile(self.archive) as archive:
            self.assertNotIn("source/.env", archive.namelist())
            self.assertEqual(archive.read("assets/dist/main.js"), b"built")


class GitHubRetryTest(unittest.TestCase):
    """Retry transient GitHub API failures without retrying permanent errors."""

    def setUp(self):
        """Create fake GitHub CLI and sleep commands."""
        self.directory = tempfile.TemporaryDirectory()
        self.addCleanup(self.directory.cleanup)
        self.bin_directory = Path(self.directory.name) / "bin"
        self.bin_directory.mkdir()
        self.calls = Path(self.directory.name) / "calls"

        gh = self.bin_directory / "gh"
        gh.write_text(
            "#!/usr/bin/env bash\n"
            "count=0\n"
            "[[ ! -f \"$GH_CALLS\" ]] || count=$(cat \"$GH_CALLS\")\n"
            "count=$((count + 1))\n"
            "echo \"$count\" > \"$GH_CALLS\"\n"
            "if (( count <= ${GH_FAIL_COUNT:-0} )); then\n"
            "  echo \"$GH_ERROR\" >&2\n"
            "  exit 1\n"
            "fi\n"
            "echo success\n"
        )
        gh.chmod(0o755)
        sleep = self.bin_directory / "sleep"
        sleep.write_text("#!/usr/bin/env bash\nexit 0\n")
        sleep.chmod(0o755)

    def run_gh_retry(self, fail_count, error):
        """Invoke the retry function with a controlled fake CLI response."""
        env = os.environ.copy()
        env.update({
            "PATH": f"{self.bin_directory}:{env['PATH']}",
            "GH_CALLS": str(self.calls),
            "GH_FAIL_COUNT": str(fail_count),
            "GH_ERROR": error,
        })
        return subprocess.run(
            [
                "bash",
                "-c",
                f"source '{Path(__file__).with_name('gh_retry.sh')}'; gh_retry api /test",
            ],
            env=env,
            capture_output=True,
            text=True,
            check=False,
        )

    def test_retries_server_errors_until_command_succeeds(self):
        """Retry transient 5xx failures and preserve successful output."""
        result = self.run_gh_retry(2, "HTTP 502: Server Error")

        self.assertEqual(result.returncode, 0)
        self.assertEqual(result.stdout.strip(), "success")
        self.assertEqual(self.calls.read_text().strip(), "3")

    def test_does_not_retry_permanent_errors(self):
        """Return immediately when the command fails for a non-transient reason."""
        result = self.run_gh_retry(5, "HTTP 404: Not Found")

        self.assertNotEqual(result.returncode, 0)
        self.assertEqual(self.calls.read_text().strip(), "1")

    def test_stops_after_bounded_transient_retries(self):
        """Return a distinct failure after exhausting transient retries."""
        result = self.run_gh_retry(5, "HTTP 502: Server Error")

        self.assertEqual(result.returncode, 75)
        self.assertEqual(self.calls.read_text().strip(), "5")


if __name__ == "__main__":
    unittest.main()
