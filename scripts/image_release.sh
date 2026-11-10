#!/usr/bin/env bash
# Validate a source tag before publishing its GHCR image.
set -euo pipefail

if [[ "$GITHUB_REF" == refs/tags/* ]]; then
    version="${GITHUB_REF#refs/tags/}"
    git fetch origin "refs/tags/$version"
    source_sha=$(git rev-parse 'FETCH_HEAD^{}')
else
    [[ "$RELEASE_HEAD_SHA" =~ ^[0-9a-f]{40}$ ]] || {
        echo "Missing release run source SHA" >&2
        exit 1
    }
    git fetch origin refs/heads/main-1.x
    branch_sha=$(git rev-parse FETCH_HEAD)
    git merge-base --is-ancestor "$RELEASE_HEAD_SHA" "$branch_sha" || {
        echo "Release source is no longer on main-1.x" >&2
        exit 1
    }
    source_sha=$(git rev-list --ancestry-path --reverse "$RELEASE_HEAD_SHA..$branch_sha" | sed -n '1p')
    source_sha=${source_sha:-$RELEASE_HEAD_SHA}
    git fetch --tags origin
    version=$(git show "$source_sha:package.json" | jq -r .version)
    if [[ -z "$version" || "$version" == null ]]; then
        echo "Release source lacks a version" >&2
        exit 1
    fi
fi

if ! [[ "$version" =~ ^v?(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)(-([0-9A-Za-z-]+)(\.[0-9A-Za-z-]+)*)?(\+([0-9A-Za-z-]+)(\.[0-9A-Za-z-]+)*)?$ ]]; then
    echo "Not a semver tag: $version; skipping image"
    exit 0
fi
if [[ "$version" == *-* ]]; then
    prerelease="${version%%+*}"
    prerelease="${prerelease#*-}"
    IFS=. read -ra identifiers <<< "$prerelease"
    for identifier in "${identifiers[@]}"; do
        if [[ "$identifier" =~ ^0[0-9]+$ ]]; then
            echo "Not a semver tag: $version; skipping image"
            exit 0
        fi
    done
fi

test "$(git show "$source_sha:package.json" | jq -r .version)" = "${version#v}" || {
    echo "Tag $version does not match package.json version" >&2
    exit 1
}
test "$(git rev-parse "refs/tags/$version^{}")" = "$source_sha" || {
    echo "Tag $version does not point at the release source" >&2
    exit 1
}
git checkout --detach "$source_sha"

echo "publish=true" >> "$GITHUB_OUTPUT"
echo "tag=${version//+/_}" >> "$GITHUB_OUTPUT"
echo "image=ghcr.io/$(printf '%s' "$GITHUB_REPOSITORY" | tr '[:upper:]' '[:lower:]')" >> "$GITHUB_OUTPUT"
