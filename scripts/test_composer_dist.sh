#!/usr/bin/env bash
# Install the local artifact in an isolated Composer consumer, without a VCS repository.
set -euo pipefail

archive=$(realpath "$1")
version=$2
scratch=$(mktemp -d)
trap 'rm -rf "$scratch"' EXIT
cd "$scratch"
composer init --no-interaction --name=styleguide/release-test --no-ansi
package=$(unzip -p "$archive" composer.json | jq --arg version "$version" --arg archive "$archive" \
    '. + {version: $version, dist: {type: "zip", url: $archive}} | del(."require-dev", .scripts)')
jq --argjson package "$package" '.repositories = [{type: "package", package: $package}]' \
    composer.json > composer.tmp.json
mv composer.tmp.json composer.json
composer require "helsingborg-stad/styleguide:$version" --prefer-dist --no-interaction --no-scripts --no-plugins
package="vendor/helsingborg-stad/styleguide"
test -f "$package/assets/dist/manifest.json"
test -f "$package/assets/dist/utility-class-map.json"
test -f "$package/assets/dist/icons/material-symbols-outlined.svg"
test -f "$package/component-design-tokens.json"
test -f "$package/source/data/design-tokens.json"
test -f "$package/composer.lock"
test -f vendor/helsingborg-stad/component-library/composer.json
test ! -d "$package/vendor"
test ! -d "$package/node_modules"
echo "Composer dist installed at package root with PHP dependencies."
