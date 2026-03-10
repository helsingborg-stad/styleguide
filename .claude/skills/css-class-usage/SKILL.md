---
name: css-class-usage
description: Get a report on CSS class usage by classname (prefix or full name) across the helsingborg-stad GitHub org, including counts and file locations.
argument-hint: <ClassName>
---

## Goal

Search for usages of a CSS class name (or prefix) across all repositories in the `helsingborg-stad` GitHub organisation and return:
1. A list of every unique class name found (e.g. `u-color__bg`, `u-color__bg--primary`, …)
2. A reference table grouped by class name, showing each file it appears in

## Arguments

- `{ClassName}` — the full class name or prefix to search for (e.g. `u-color__bg` or `c-card`)

## Step 1 — Authenticate and search

GitHub code search requires authentication. Try the methods below in order until one succeeds.

### Method A — gh CLI (preferred)

```sh
gh search code "{ClassName}" --owner helsingborg-stad --limit 200 --json repository,path,url
```

Ignore all matches found in: https://github.com/helsingborg-stad/styleguide 

### Method B — curl with GITHUB_TOKEN

```sh
curl -s \
  -H "Authorization: Bearer $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github+json" \
  "https://api.github.com/search/code?q={ClassName}+org:helsingborg-stad&per_page=100&page=1"
```

Ignore all matches found in: https://github.com/helsingborg-stad/styleguide 

If `total_count` exceeds 100, repeat with `page=2`, `page=3`, … until all results are collected.

Each item in the `items` array contains:
- `repository.name` — repository name
- `path` — file path within the repo
- `html_url` — direct link to the file

### Method C — no auth available

If neither `gh` nor `GITHUB_TOKEN` is available, stop and tell the user:

> Authentication required. Set `GITHUB_TOKEN` in your environment or install the `gh` CLI and run `gh auth login`.

## Step 2 — Fetch file contents and extract class names

For each file returned in Step 1, fetch its raw content via the GitHub API:

```sh
gh api repos/helsingborg-stad/{repo}/contents/{path} --jq '.content' | base64 -d
```

From the content, extract every CSS class that matches the search term using this regex pattern:

```
{ClassName}(--[\w-]+)?
```

This captures both:
- The base class itself (e.g. `u-color__bg`)
- All modifier variants (e.g. `u-color__bg--primary`, `u-color__bg--complementary-lighter`)

Collect all matches across all files, deduplicated per file.

## Step 3 — Output: unique class list

Print a sorted, deduplicated plain-text list of every class name found across all files:

```
u-color__bg
u-color__bg--complementary
u-color__bg--complementary-lighter
u-color__bg--danger
…
```

## Step 4 — Output: reference table

Print a Markdown reference table sorted by class name, then by repository, then by file path:

| Class | Repository | File | Link |
|---|---|---|---|
| `u-color__bg--primary` | repo-name | path/to/file.php | [view](https://github.com/helsingborg-stad/repo-name/blob/main/path/to/file.php) |

## Step 5 — Summary line

End with a single summary line:

```
Total: {N} unique class names across {M} repositories ({F} files)
```
