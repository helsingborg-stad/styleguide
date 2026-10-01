#!/usr/bin/env bash

set -euo pipefail

usage() {
    echo "Usage: $0 <version> [--plugin-file <path>]" >&2
    exit 64
}

[[ $# -ge 1 ]] || usage

VERSION="$1"
shift
PLUGIN_FILE=""

while [[ $# -gt 0 ]]; do
    case "$1" in
        --plugin-file)
            [[ $# -ge 2 ]] || usage
            PLUGIN_FILE="$2"
            shift 2
            ;;
        *)
            usage
            ;;
    esac
done

[[ "$VERSION" =~ ^[0-9]+\.[0-9]+\.[0-9]+(-[0-9A-Za-z.-]+)?(\+[0-9A-Za-z.-]+)?$ ]] || {
    echo "Version must be a semantic version (for example, 3.36.0)." >&2
    exit 65
}

export RELEASE_VERSION="$VERSION"
node <<'NODE'
const fs = require('fs');

const version = process.env.RELEASE_VERSION;
const files = [
  ['package.json', data => { data.version = version; }],
  ['package-lock.json', data => {
    data.version = version;
    data.packages[''].version = version;
  }],
  ['composer.json', data => { data.version = version; }],
];

for (const [file, update] of files) {
  const contents = fs.readFileSync(file, 'utf8');
  const indent = contents.match(/^\s+(?=")/m)?.[0] ?? '  ';
  const data = JSON.parse(contents);
  update(data);
  fs.writeFileSync(file, `${JSON.stringify(data, null, indent)}\n`);
}
NODE

if [[ -n "$PLUGIN_FILE" ]]; then
    [[ -f "$PLUGIN_FILE" ]] || {
        echo "Plugin header file does not exist: $PLUGIN_FILE" >&2
        exit 66
    }

    export RELEASE_PLUGIN_FILE="$PLUGIN_FILE"
    node <<'NODE'
const fs = require('fs');

const file = process.env.RELEASE_PLUGIN_FILE;
const version = process.env.RELEASE_VERSION;
const contents = fs.readFileSync(file, 'utf8');
const updated = contents.replace(/^(\s*\*?\s*Version:\s*).*/mi, `$1${version}`);

if (updated === contents) {
  throw new Error(`No WordPress Version header found in ${file}`);
}

fs.writeFileSync(file, updated);
NODE
fi

echo "Prepared release version $VERSION"
