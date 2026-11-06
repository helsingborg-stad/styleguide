#!/usr/bin/env bash
# Publish a validated ZIP without changing an existing tag or release asset.
set -euo pipefail

version=$1
source_sha=$2
archive=$3
repository=$4
tag_ref="refs/tags/$version"
asset="styleguide-$version.zip"

[[ "$version" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]] || { echo "Invalid version: $version" >&2; exit 1; }
[[ "$source_sha" =~ ^[0-9a-f]{40}$ ]] || { echo "Invalid source SHA" >&2; exit 1; }
[[ $(git rev-parse HEAD) == "$source_sha" ]] || { echo "Working tree is not the source commit" >&2; exit 1; }
[[ $(git ls-remote origin refs/heads/main-1.x | cut -f1) == "$source_sha" ]] || {
    echo "main-1.x advanced during build; retry from its new tip" >&2; exit 1;
}
python3 scripts/release_package.py check "$archive"
expected=$(sha256sum "$archive" | cut -d' ' -f1)
downloaded=$(mktemp -d)
trap 'rm -rf "$downloaded"' EXIT

remote_tag=$(git ls-remote origin "$tag_ref" | cut -f1)
if [[ -n "$remote_tag" ]]; then
    git fetch origin "$tag_ref"
    [[ $(git rev-parse "FETCH_HEAD^{}") == "$source_sha" ]] || {
        echo "Existing tag points at a different source commit" >&2; exit 1;
    }
fi

if gh release view "$version" --repo "$repository" --json isDraft,assets >/dev/null 2>&1; then
    # Never overwrite an existing asset, even on a draft release.
    existing=$(gh release view "$version" --repo "$repository" --json assets --jq ".assets[] | select(.name == \"$asset\") | .name")
    if [[ -n "$existing" ]]; then
        gh release download "$version" --repo "$repository" --pattern "$asset" --dir "$downloaded"
        [[ $(sha256sum "$downloaded/$asset" | cut -d' ' -f1) == "$expected" ]] || {
            echo "Existing release asset differs; refusing to replace it" >&2; exit 1;
        }
    else
        [[ $(gh release view "$version" --repo "$repository" --json isDraft --jq .isDraft) == true ]] || {
            echo "Published release is missing the asset; manual intervention required" >&2; exit 1;
        }
        gh release upload "$version" "$archive#$asset" --repo "$repository"
    fi
else
    # GitHub may create the tag while creating a draft release. The asset is
    # uploaded before the draft is published, but indexing can still race it.
    gh release create "$version" "$archive#$asset" --repo "$repository" \
        --target "$source_sha" --draft --generate-notes
fi

git fetch origin "$tag_ref"
[[ $(git rev-parse "FETCH_HEAD^{}") == "$source_sha" ]] || {
    echo "Release tag points at a different source commit" >&2; exit 1;
}
if [[ ! -f "$downloaded/$asset" ]]; then
    gh release download "$version" --repo "$repository" --pattern "$asset" --dir "$downloaded"
fi
[[ $(sha256sum "$downloaded/$asset" | cut -d' ' -f1) == "$expected" ]] || {
    echo "Uploaded release asset differs from the validated build" >&2; exit 1;
}
gh release edit "$version" --repo "$repository" --draft=false
