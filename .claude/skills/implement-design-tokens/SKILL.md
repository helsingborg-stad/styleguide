---
name: implement-design-tokens
description: Migrate a component SCSS file from raw var_default variables to the design token mixin pattern, then verify visually with Playwright. Usage: /implement-design-tokens {ComponentScssName} {PreviewUrl}
argument-hint: <ComponentScssName> <PreviewUrl>
allowed-tools: Read, Glob, Grep, Write, Edit, Bash, Task
---

Migrate a component SCSS file to use the project's design token mixin pattern and verify there is no visual regression.

## Arguments

Parse `$ARGUMENTS` as: `{ComponentScssName} {PreviewUrl}`

- `ComponentScssName` — the SCSS partial name without leading underscore or extension (e.g. `logotypegrid`, `hero`, `card`). The file lives at `source/sass/component/_{ComponentScssName}.scss`.
- `PreviewUrl` — full URL of the styleguide page to screenshot for visual comparison (e.g. `http://localhost:8080/components/molecules/logotypegrid`). If not provided, skip the Playwright verification step and note the omission.

## Background: the token system

### How tokens work

The project exposes global CSS custom properties in `:root` (defined in `source/sass/setting/_design-tokens.scss`). Each component gets its own scoped copies via the `tokens` mixin:

```scss
@use "../mixin/tokens";

$_: "c-{name}";

@include tokens.create($_, getComponentTokens($_));
```

`getComponentTokens` is a custom Sass function (defined in `vite.config.mjs`) that reads `source/data/c-{name}.json` and returns the list of token names registered for this component.

### Mixin API

| Function / mixin | Output | Use for |
|---|---|---|
| `tokens.use($_, "base", N)` | `calc(var(--c-{name}--base) * N)` | Spacing/sizing multiples of `--base` |
| `tokens.use($_, "space", N)` | `calc(var(--c-{name}--space) * var(--base) * N)` | Spacing multiples of `--space` |
| `tokens.use($_, "shadow", N)` | `drop-shadow(…)` | Filter drop-shadow |
| `tokens.get($_, "token-name")` | `var(--c-{name}--token-name)` | Raw token reference (colors, border-radius, etc.) |
| `@include tokens.create($_, list, extras, inner)` | Emits CSS custom properties on `.c-{name}` | Registers all tokens |

### Token-to-variable mapping

| Old pattern | Token name | New pattern |
|---|---|---|
| `calc(#{var_default.$base} * N)` | `base` | `tokens.use($_, "base", N)` |
| `calc(#{var_default.$base} * N)` (spacing context) | `space` | `tokens.use($_, "space", N)` |
| `var_colors.$...` or raw color hex | `color--primary`, `color--surface`, etc. | `tokens.get($_, "color--…")` |
| `var_border-radius.$...` | `border-radius` | `tokens.get($_, "border-radius")` |
| `var_fonts.$...` or raw font values | `font-size-100` … `font-size-700` etc. | `tokens.get($_, "font-size-…")` |

## Step 1 — Take a baseline screenshot

Before touching any code, capture the current visual state. Use the Playwright Node.js binary at `node_modules/.bin/playwright` (or a script at `screenshot.js` in the repo root):

```sh
node screenshot.js {PreviewUrl} /tmp/{ComponentScssName}-before.png
```

If the URL returns 404, try port 8080 (Apache serves the PHP app there). The Vite dev server on other ports only serves assets.

## Step 2 — Read and analyse the current SCSS

Read `source/sass/component/_{ComponentScssName}.scss` in full.

**If the component already uses `tokens.create`/`tokens.get`/`tokens.use`**, it has been partially migrated. In that case, look specifically for:
- Any remaining `@use "../setting/var_*"` statements (especially `var_properties` for z-index)
- Tokens registered in the JSON but not referenced in the SCSS (cleanup)
- `base` token handled only via the `extras` map rather than the JSON token list

**If the component is not yet migrated**, identify every usage of legacy variable patterns:
- `@use "../setting/var_default"` → `var_default.$base`, `var_default.$spacers`, etc.
- `@use "../setting/var_colors"` → raw color variables
- `@use "../setting/var_border-radius"` → border radius variables
- `@use "../setting/var_fonts"` → font variables
- `@use "../setting/var_properties"` → misc properties (z-index levels, etc.)

**Handling `var_properties.$level-N` (z-index):** These are plain z-index values, NOT design tokens. Replace with the literal number (e.g. `var_properties.$level-5` → `5000`). Do not create a token for z-index.

List the token names needed. Cross-reference with the available global tokens in `source/sass/setting/_design-tokens.scss` and existing component JSON files in `source/data/` to understand naming conventions.

## Step 3 — Read reference files

Read these files to understand the full context before writing any code:

1. `source/sass/mixin/_tokens.scss` — the mixin API
2. `source/sass/setting/_design-tokens.scss` — all available global tokens
3. A recently updated component for style reference, e.g. `source/sass/component/_logotype.scss` or `source/sass/component/_hero.scss`
4. The existing `source/data/c-{name}.json` if it exists

## Step 4 — Create or update the data JSON

The file `source/data/c-{ComponentScssName}.json` must list every token the component will use.

If the file does not exist, create it:

```json
{
    "tokens": [
        "base"
    ]
}
```

Only include tokens actually referenced in the SCSS. Common token names: `base`, `space`, `border-radius`, `color--primary`, `color--surface`, `color--alpha`, `shadow`, `font-size-100` … `font-size-700`.

**Important token rules:**
- `base` — include if `tokens.use($_, "base", N)` or `tokens.get($_, "base")` is used anywhere. Do NOT also put `"base": "var(--base)"` in the extras map — that's redundant once `base` is in the JSON.
- `space` — only include if `tokens.use($_, "space", N)` is actually used in the SCSS. Remove it if present but unused.
- `shadow` — include if `tokens.get($_, "shadow")` or `tokens.use($_, "shadow", N)` is used. When the shadow token is in the JSON, its sub-tokens (`--shadow-color`, `--shadow-amount`, etc.) are auto-derived and available for use in `tokens.use($_, "shadow", N)` inside the extras map.
- Color companion tokens (`color--primary-contrast`, `color--surface-border`, etc.) are **auto-derived** by `tokens.create` from their parent color token. Do NOT list them in the JSON — just list `color--primary` or `color--surface` and the contrast/border variants come for free.

**Cleanup tip:** If the JSON already exists, cross-check every entry against the SCSS. Remove any token from the JSON that is never referenced in the SCSS via `tokens.get` or `tokens.use`.

## Step 5 — Rewrite the SCSS

Replace the contents of `source/sass/component/_{ComponentScssName}.scss` following this structure:

```scss
@use "../mixin/tokens";
// Keep any other @use statements that are still needed (e.g. mixin imports)

$_: "c-{ComponentScssName}";

@include tokens.create($_, getComponentTokens($_));
// Add extras map if custom-valued tokens are needed:
// @include tokens.create($_, getComponentTokens($_),
//     ("my-token": some-value));

.#{$_} {
    // Replace calc(#{var_default.$base} * N) → tokens.use($_, "base", N)
    // Replace color vars           → tokens.get($_, "color--…")
    // Replace border-radius vars   → tokens.get($_, "border-radius")
    // Keep structural CSS (display, flex-wrap, object-fit, etc.) unchanged
}
```

Rules:
- Remove `@use "../setting/var_default"` (and other setting `@use` statements) once replaced.
- Keep `@use` statements for mixins/animations that are still used.
- Use `$_` as the BEM block name consistently: `.#{$_}`, `.#{$_}__element`, `&--modifier`.
- Do not change structural CSS (display, position, overflow, flex-wrap, object-fit, etc.).
- Do not add tokens for values that aren't configurable global tokens (e.g. `z-index: 2`, `50%`, literal pixel values specific to this component).
- If the component was already partially migrated (already has `tokens.create`), focus changes on removing remaining legacy `@use` imports and cleaning up the extras map rather than rewriting the whole file.

## Step 6 — Build and take an after screenshot, then compare

After saving the file, run the build so the SCSS changes are compiled before screenshotting:

```sh
npm run build
```

Then capture a new screenshot and compare:

```sh
node screenshot.js {PreviewUrl} /tmp/{ComponentScssName}-after.png
node screenshot.js --compare /tmp/{ComponentScssName}-before.png /tmp/{ComponentScssName}-after.png
```

If the screenshots differ meaningfully, investigate — check the browser console for SCSS compilation errors, inspect the compiled CSS, and fix the token mappings before reporting success.

## Step 7 — Report

Tell the user:
- Which tokens were registered in the JSON file
- Which `@use` statements were removed
- Which replacements were made (old pattern → new pattern)
- The visual comparison result (identical / minor difference / regression found)
