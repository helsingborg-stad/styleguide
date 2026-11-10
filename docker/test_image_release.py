"""Verify that only matching semver source tags can publish container images."""

import json
import os
import subprocess
import tempfile
import unittest
from pathlib import Path


SCRIPT = Path(__file__).with_name("image_release.sh")


class ImageReleaseTest(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.root = Path(self.tmp.name)
        self.repo = self.root / "source"
        self.remote = self.root / "origin.git"
        self.repo.mkdir()
        self.git("init", "-q")
        self.git("config", "user.email", "test@example.com")
        self.git("config", "user.name", "Test")
        subprocess.run(["git", "init", "--bare", "-q", str(self.remote)], check=True)
        self.git("remote", "add", "origin", str(self.remote))
        (self.repo / "base").write_text("base")
        self.git("add", "base")
        self.git("commit", "-qm", "base")
        self.release_head_sha = self.git("rev-parse", "HEAD")

    def git(self, *args):
        return subprocess.run(
            ["git", *args], cwd=self.repo, check=True, capture_output=True, text=True
        ).stdout.strip()

    def publish(self, version, tag, ref=None, annotated=False, advance=False, tag_previous=False):
        (self.repo / "package.json").write_text(json.dumps({"version": version}))
        self.git("add", "package.json")
        self.git("commit", "-qm", "source")
        tagged_sha = self.release_head_sha if tag_previous else self.git("rev-parse", "HEAD")
        if annotated:
            self.git("tag", "-am", "release", tag, tagged_sha)
        else:
            self.git("tag", tag, tagged_sha)
        self.git("push", "-q", "origin", f"refs/tags/{tag}")
        if advance:
            (self.repo / "other").write_text("different commit")
            self.git("add", "other")
            self.git("commit", "-qm", "advance")
        self.git("push", "-q", "origin", "HEAD:refs/heads/main-1.x")
        output = self.root / "output"
        env = {
            **os.environ,
            "GITHUB_REF": ref or f"refs/tags/{tag}",
            "GITHUB_OUTPUT": str(output),
            "GITHUB_REPOSITORY": "Helsingborg-Stad/Styleguide",
            "RELEASE_HEAD_SHA": self.release_head_sha,
        }
        result = subprocess.run(
            ["bash", str(SCRIPT)], cwd=self.repo, env=env, capture_output=True, text=True
        )
        return result, output.read_text() if output.exists() else ""

    def test_release_job_publishes_new_tag(self):
        result, output = self.publish("1.2.3", "1.2.3", ref="refs/heads/main-1.x")
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertIn("publish=true\n", output)
        self.assertIn("tag=1.2.3\n", output)
        self.assertIn("image=ghcr.io/helsingborg-stad/styleguide\n", output)

    def test_release_run_resolves_tag_after_branch_advances(self):
        result, output = self.publish(
            "1.2.3", "1.2.3", ref="refs/heads/main-1.x", advance=True
        )
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertIn("tag=1.2.3\n", output)

    def test_annotated_prefixed_prerelease_with_build_metadata(self):
        result, output = self.publish(
            "1.2.3-rc.1+build.7", "v1.2.3-rc.1+build.7", annotated=True
        )
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertIn("tag=v1.2.3-rc.1_build.7\n", output)

    def test_non_semver_tag_is_skipped(self):
        result, output = self.publish("1.2.3", "release")
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(output, "")

    def test_leading_zero_prerelease_is_skipped(self):
        result, output = self.publish("1.2.3-rc.01", "v1.2.3-rc.01")
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(output, "")

    def test_version_mismatch_fails(self):
        result, output = self.publish("1.2.4", "1.2.3")
        self.assertNotEqual(result.returncode, 0)
        self.assertEqual(output, "")

    def test_release_tag_on_wrong_commit_fails(self):
        result, output = self.publish(
            "1.2.3", "1.2.3", ref="refs/heads/main-1.x", tag_previous=True
        )
        self.assertNotEqual(result.returncode, 0)
        self.assertEqual(output, "")


if __name__ == "__main__":
    unittest.main()
