---
name: remove-tokens-extras
description: Remove the $extras parameter from tokens.create() in a component SCSS file, moving the extra tokens into the component selector as CSS custom properties. Usage: /remove-tokens-extras {ComponentPath}
argument-hint: <ComponentPath>
allowed-tools: Read, Edit, Bash
---

Remove the `$extras` (third argument) from a `tokens.create()` call in a component SCSS file, and move those extra tokens into the component selector as CSS custom properties.

## Arguments

Parse `$ARGUMENTS` as: `{ComponentPath}`

- `ComponentPath` — path to the component SCSS file relative to the repo root (e.g. `source/components/button/style.scss` or `source/components/card/style.scss`).

## Background: what you are fixing

The `tokens.create` mixin previously accepted a third `$extras` map argument — a Sass map of custom key-value token pairs that were emitted as CSS custom properties. This third argument has been removed from the mixin. All extra tokens must now be declared as CSS custom properties directly inside the component selector.

**Before:**
```scss
@include tokens.create($_, getComponentTokens($_), (
    "border": tokens.use($_, "border-width", 1) solid tokens.get($_, "color--surface-border"),
    "shadow": tokens.use($_, "shadow", 1),
));

.#{$_} {
    border-top: tokens.get($_, "border");
    filter: tokens.get($_, "shadow");
}
```

**After:**
```scss
@include tokens.create($_, getComponentTokens($_));

.#{$_} {
    --#{$_}--border: tokens.use($_, "border-width", 1) solid tokens.get($_, "color--surface-border");
    --#{$_}--shadow: tokens.use($_, "shadow", 1);
    border-top: var(--#{$_}--border);
    filter: var(--#{$_}--shadow);
}
```

Key rules:
- The extra tokens move to the **top** of the component selector block as `--#{$_}--key: value;`
- Any `tokens.get($_, "key")` call that referenced an extras key becomes `var(--#{$_}--key)`
- Global token references (`tokens.get($_, "color--surface")`) and `tokens.use(...)` calls that were NOT in extras remain unchanged

## Step 1 — Read the file

Read the full file at `{ComponentPath}`.

## Step 2 — Identify the extras map

Find the `tokens.create(...)` call and extract every key-value pair from the third argument (the Sass map). Note each key and its value expression exactly.

## Step 3 — Find usages of extras keys

Search the file for any `tokens.get($_, "{key}")` calls where `{key}` is one of the extras keys. These must be replaced with `var(--#{$_}--{key})`.

Note: only `tokens.get` references to extras keys are affected. `tokens.use` calls that happen to use the same name are not extras references — leave them untouched.

## Step 4 — Apply the changes

Make these edits using the Edit tool:

1. **Remove the extras map** from the `tokens.create(...)` call, leaving just:
   ```scss
   @include tokens.create($_, getComponentTokens($_));
   ```

2. **Add CSS custom properties** at the top of the component selector block (`.#{$_} {`):
   ```scss
   .#{$_} {
       --#{$_}--key: value;
       // ... rest of existing styles
   ```

3. **Replace each** `tokens.get($_, "{key}")` that referenced an extras key with `var(--#{$_}--{key})`.

## Step 5 — Verify

Run a quick grep to confirm no extras argument remains in `tokens.create` and no `tokens.get` references to the old extras keys remain:

```sh
grep -n 'tokens\.create' {ComponentPath}
grep -n 'tokens\.get' {ComponentPath}
```

## Step 6 — Report

Tell the user:
- Which extras keys were moved and their values
- Which `tokens.get` calls were replaced with `var(...)` references
- Confirmation that `tokens.create` now has no third argument
