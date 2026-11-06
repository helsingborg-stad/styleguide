gh_retry() {
    local attempt=1
    local max_attempts=5
    local delay=2
    local status
    local error_file

    error_file=$(mktemp)
    while :; do
        if gh "$@" 2>"$error_file"; then
            cat "$error_file" >&2
            rm -f "$error_file"
            return 0
        else
            status=$?
        fi

        cat "$error_file" >&2
        if ! grep -Eiq 'HTTP (429|5[0-9][0-9])|connection reset|connection refused|timed? out|TLS handshake' "$error_file"; then
            rm -f "$error_file"
            return "$status"
        fi

        if (( attempt >= max_attempts )); then
            rm -f "$error_file"
            return 75
        fi

        sleep "$delay"
        delay=$((delay * 2))
        attempt=$((attempt + 1))
    done
}
