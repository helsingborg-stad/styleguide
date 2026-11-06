#!/usr/bin/env bash
# Verify a published pilot against real Packagist metadata and a clean consumer.
set -euo pipefail

version=$1
composer_bin=${2:-composer}
composer_bin=$(command -v "$composer_bin")
composer_bin=$(realpath "$composer_bin")
expected="https://github.com/helsingborg-stad/styleguide/releases/download/%prettyVersion%/styleguide-%prettyVersion%.zip"
actual=$(curl --fail --silent --show-error --retry 5 \
    https://repo.packagist.org/p2/helsingborg-stad/styleguide.json |
    jq -r --arg version "$version" '.packages["helsingborg-stad/styleguide"][] | select(.version == $version) | .dist.url')
[[ "$actual" == "$expected" ]] || {
    echo "Packagist does not publish the expected dist URL for $version: $actual" >&2
    exit 1
}

scratch=$(mktemp -d)
trap 'rm -rf "$scratch"' EXIT
for preference in dist source; do
    mkdir "$scratch/$preference"
    cd "$scratch/$preference"
    "$composer_bin" init --name=styleguide/pilot-test --no-interaction
    "$composer_bin" require "helsingborg-stad/styleguide:$version" \
        "--prefer-$preference" --no-interaction --no-scripts --no-plugins
    package=vendor/helsingborg-stad/styleguide
    test -f "$package/composer.json"
    test -f vendor/helsingborg-stad/component-library/composer.json
    if [[ "$preference" == dist ]]; then
        test -f "$package/assets/dist/manifest.json"
        test -f "$package/assets/dist/utility-class-map.json"
        test -f "$package/assets/dist/icons/material-symbols-outlined.svg"
        test ! -d "$package/.git"
    else
        test -d "$package/.git"
    fi
done
echo "Packagist dist and source installs verified with $("$composer_bin" --version)."
