---
name: css-class-usage
description: Get a report on CSS class usage by classname (prefix or full name) across the helsingborg-stad GitHub org, including counts and file locations.
argument-hint: <ClassName>
---

## Goal

Search for usages of a CSS class name (or prefix) across all repositories in the `helsingborg-stad` GitHub organisation and return:
1. A plain list of every matching file
2. A summary reference table grouped by repository

## Arguments

- `{ClassName}` — the full class name or prefix to search for (e.g. `u-color__bg` or `c-card`)

## Step 1 — Authenticate and search

GitHub code search requires authentication. Try the methods below in order until one succeeds.

### Method A — gh CLI (preferred)

```sh
gh search code "{ClassName}" --owner helsingborg-stad --limit 200 --json repository,path,url
```

### Method B — curl with GITHUB_TOKEN

```sh
curl -s \
  -H "Authorization: Bearer $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github+json" \
  "https://api.github.com/search/code?q={ClassName}+org:helsingborg-stad&per_page=100&page=1"
```

If `total_count` exceeds 100, repeat with `page=2`, `page=3`, … until all results are collected.

Each item in the `items` array contains:
- `repository.name` — repository name
- `path` — file path within the repo
- `html_url` — direct link to the file

### Method C — no auth available

If neither `gh` nor `GITHUB_TOKEN` is available, stop and tell the user:

> Authentication required. Set `GITHUB_TOKEN` in your environment or install the `gh` CLI and run `gh auth login`.

## Step 2 — Output: plain list

Print a plain-text list of every matching file, one per line:

```
{repo}/{filepath}
{repo}/{filepath}
…
```

## Step 3 — Output: reference table

After the plain list, print a Markdown reference table grouped by repository:

| Repository | File | Link |
|---|---|---|
| repo-name | path/to/file.php | [view](https://github.com/helsingborg-stad/repo-name/blob/main/path/to/file.php) |

Sort rows alphabetically by repository, then by file path within each repository.

## Step 4 — Summary line

End with a single summary line:

```
Total: {N} files across {M} repositories
```
