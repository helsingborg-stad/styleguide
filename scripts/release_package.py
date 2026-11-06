#!/usr/bin/env python3
"""Build and validate the portable Composer release archive."""

import argparse
import json
import re
import subprocess
import sys
import zipfile
from pathlib import Path, PurePosixPath

ROOT_FILES = {
    "component-design-tokens.json",
    "composer.json",
    "composer.lock",
    "LICENSE",
    "README.md",
}
ROOT_DIRS = {"assets", "source"}
REQUIRED = ROOT_FILES | {
    "source/data/design-tokens.json",
    "assets/dist/manifest.json",
    "assets/dist/utility-class-map.json",
    "assets/dist/icons/material-symbols-outlined.svg",
}
ENTRY_KEYS = {"css/styleguide-css.css", "js/styleguide-js.js"}
FORBIDDEN = re.compile(r"(^|/)(vendor|node_modules|\.git|\.github|\.npmrc|\.env(?:\..*)?|.*\.(?:pem|key|crt))(/|$)", re.I)
VENDOR_URL = re.compile(r"url\(\s*['\"]?[^)'\"\s]*vendor/", re.I)


def allowed(name):
    """Accept only regular files in the release root allowlist."""
    path = PurePosixPath(name)
    return (
        not path.is_absolute()
        and ".." not in path.parts
        and not FORBIDDEN.search(name)
        and (name in ROOT_FILES or (len(path.parts) > 1 and path.parts[0] in ROOT_DIRS))
    )


def validate(archive):
    """Reject incomplete, unsafe or incorrectly rooted release archives."""
    with zipfile.ZipFile(archive) as package:
        names = package.namelist()
        files = set(names)
        if len(files) != len(names) or not all(allowed(name) for name in names):
            raise ValueError("Duplicate, forbidden or unrooted archive entry")
        if not REQUIRED <= files:
            raise ValueError(f"Missing required files: {sorted(REQUIRED - files)}")
        for info in package.infolist():
            if info.is_dir() or (info.external_attr >> 16) & 0o170000 == 0o120000:
                raise ValueError(f"Directory or symlink in archive: {info.filename}")
        manifest = json.loads(package.read("assets/dist/manifest.json"))
        if not isinstance(manifest, dict) or not ENTRY_KEYS <= manifest.keys():
            raise ValueError("Missing required manifest entries")
        for entry in manifest.values():
            if not isinstance(entry, str) or entry.startswith("/") or ".." in PurePosixPath(entry).parts:
                raise ValueError(f"Unsafe manifest entry: {entry}")
            if f"assets/dist/{entry}" not in files:
                raise ValueError(f"Missing manifest asset: {entry}")
        for name in files:
            if name.startswith("assets/dist/") and name.endswith(".css"):
                if VENDOR_URL.search(package.read(name).decode("utf-8")):
                    raise ValueError(f"Unresolved vendor URL in {name}")
        json.loads(package.read("assets/dist/utility-class-map.json"))
        json.loads(package.read("component-design-tokens.json"))
        json.loads(package.read("source/data/design-tokens.json"))
        if package.testzip():
            raise ValueError("Corrupt archive member")


def create(root, archive):
    """Archive tracked runtime inputs and every generated Vite output."""
    tracked = subprocess.check_output(
        ["git", "-C", str(root), "ls-files", "-z", "--", *sorted(ROOT_FILES | ROOT_DIRS)]
    ).decode().split("\0")
    generated = (root / "assets/dist").rglob("*")
    names = {name for name in tracked if name and allowed(name)}
    names.update(str(path.relative_to(root)) for path in generated if path.is_file())
    if not REQUIRED <= names:
        raise ValueError(f"Missing build inputs: {sorted(REQUIRED - names)}")
    archive.parent.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(archive, "w", compression=zipfile.ZIP_DEFLATED) as package:
        for name in sorted(names):
            path = root / name
            if (
                not allowed(name)
                or not path.is_file()
                or not path.resolve().is_relative_to(root)
                or any(parent.is_symlink() for parent in (path, *path.parents) if parent != root)
            ):
                raise ValueError(f"Unsafe or missing input: {name}")
            info = zipfile.ZipInfo(name, date_time=(1980, 1, 1, 0, 0, 0))
            info.external_attr = 0o100644 << 16
            info.compress_type = zipfile.ZIP_DEFLATED
            package.writestr(info, path.read_bytes())
    validate(archive)


def main():
    """Run the local archive create or check command."""
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("command", choices=("create", "check"))
    parser.add_argument("archive", type=Path)
    parser.add_argument("--root", type=Path, default=Path(__file__).resolve().parents[1])
    args = parser.parse_args()
    try:
        if args.command == "create":
            create(args.root.resolve(), args.archive)
        else:
            validate(args.archive)
    except (ValueError, OSError, subprocess.CalledProcessError, zipfile.BadZipFile) as error:
        parser.exit(1, f"Release archive invalid: {error}\n")


if __name__ == "__main__":
    main()
