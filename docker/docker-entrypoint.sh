#!/bin/sh
set -eu

# Blade compiles templates into the system temp dir. Fail fast with a clear
# message instead of erroring on every request when it is not writable (for
# example with readOnlyRootFilesystem and no emptyDir mounted at /tmp).
tmp_dir="${TMPDIR:-/tmp}"
probe="$tmp_dir/.styleguide-write-test.$$"
if ! (: > "$probe") 2>/dev/null; then
    echo "error: $tmp_dir is not writable by $(id -un) (uid $(id -u))." >&2
    echo "Compiled Blade templates are stored there. With a read-only root" >&2
    echo "filesystem, mount a writable volume (e.g. an emptyDir) at $tmp_dir." >&2
    exit 1
fi
rm -f "$probe"

exec docker-php-entrypoint "$@"
