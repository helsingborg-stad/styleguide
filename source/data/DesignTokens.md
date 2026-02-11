# Design Tokens Philosophy & Usage Rules

## Philosophy

Design tokens are the single source of truth for storing design-related values such as colors, typography, spacing, and more. They enable consistency, scalability, and maintainability across products and platforms. By abstracting raw values into meaningful names, design tokens bridge the gap between design and development, ensuring a unified visual language.

## Usage Rules

1. **Single Source of Truth**  
  All design decisions (colors, spacing, typography, etc.) must be represented as tokens. Do not hardcode values in CSS or components.

2. **Naming Conventions**  
  Use clear, descriptive, and hierarchical names (e.g., `color-primary-background`, `font-size-heading-lg`).

3. **Composability**  
  Tokens can be combined, but only in documented, viable combinations. For example, only use `color-primary` with approved background or text tokens.

4. **No Arbitrary Overrides**  
  Do not override tokens at the component level, instead allow override by localizing them. The styleguide itself are not allowed to do any modification other than allowing implementation to override. Eg. Card componen should have: 

  ```
  .c-card {
    --c-card--color-background: var(--color--background);
    --c-card--color-background-contrast: var(--color--background-contrast);  
  }
  ```
  Implementation developers may then set a explicit value for --c-card--color-background in order to change the apperance of cards. 

## Viable Combinations

- Only combine tokens as documented in the design system.
- Do not mix tokens from different categories unless explicitly allowed.
- Refer to the design system documentation for approved token pairings.
- Run tests in order to valiudate that sass is adhering to ruleset. 

## Design tokens sass generation

The file `source/sass/setting/_design-tokens.scss` is **auto-generated** from `source/data/design-tokens.json` and must never be edited manually. Any manual changes will be overwritten on the next build.

### How it works

A Node.js compiler (`build-design-tokens.mjs`) reads the JSON and outputs a `:root` block with all tokens as CSS custom properties, organized by category.

### Running the compiler

```bash
# Standalone
npm run tokens

# Runs automatically before build
npm run build
```

### Workflow

1. Edit `source/data/design-tokens.json`
2. Run `npm run tokens` (or `npm run build`)
3. The generated `_design-tokens.scss` is gitignored — it is always rebuilt from the JSON source

### Generated file location

`source/sass/setting/_design-tokens.scss`

This file is listed in `.gitignore` and should not be committed.