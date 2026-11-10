#!/usr/bin/env bash
# Validate a source tag before publishing its GHCR image.
set -euo pipefail

if [[ "$GITHUB_REF" == refs/tags/* ]]; then
    version="${GITHUB_REF#refs/tags/}"
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
else
    version="$RELEASE_VERSION"
fi

test "$(jq -r .version package.json)" = "${version#v}" || {
    echo "Tag $version does not match package.json version" >&2
    exit 1
}
git fetch origin "refs/tags/$version"
test "$(git rev-parse 'FETCH_HEAD^{}')" = "$(git rev-parse HEAD)" || {
    echo "Tag $version does not point at the checked-out source" >&2
    exit 1
}

echo "publish=true" >> "$GITHUB_OUTPUT"
echo "tag=${version//+/_}" >> "$GITHUB_OUTPUT"
echo "image=ghcr.io/$(printf '%s' "$GITHUB_REPOSITORY" | tr '[:upper:]' '[:lower:]')" >> "$GITHUB_OUTPUT"
