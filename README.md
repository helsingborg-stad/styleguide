<!-- SHIELDS -->
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![License][license-shield]][license-url]

<p>
  <a href="https://github.com/helsingborg-stad/styleguide">
    <img src="docs/images/hbg-github-logo-combo.png" alt="Logo" width="300">
  </a>
</p>
<h1>Styleguide</h1>
<p>
  <br />
  <a href="https://github.com/helsingborg-stad/styleguide/issues">Report Bug</a>
  ·
  <a href="https://github.com/helsingborg-stad/styleguide/issues">Request Feature</a>
</p>


## Summary
The style guide is intended for websites within Helsingborgs stad / Municipio Websites and others who use our platform. The guide provides examples, markup and themes for our standardized components. The Helsingborg Styleguide is a flexible and minimalistic component-based framework built in the BEM standard & designed around the Atomic Design principle.

## Release Notes

- [Municipio 6 release: Styleguide and design tokens](docs/municipio-6-release-article.md)

### Requirements

- NodeJS >= 16
- PHP >= 8
- [Composer](https://getcomposer.org/)

## Installation
1. Clone the repo:
  ```sh
  git clone git@github.com:helsingborg-stad/styleguide.git
  ```
2. Run the build script in the cloned project:
  ```sh
  cd styleguide && php build.php
  ```

## Development
1. Start by running the steps under [Installation](#installation).
2. Run webpack in watch-mode:
  ```sh
  npm run watch
  ```

### Storybook (Blade-rendered components)

Storybook is configured as a frontend shell while components continue to be rendered by Blade.

Run:

```sh
npm run storybook
```

This starts:

- Storybook UI on `http://localhost:6006`
- PHP server for Blade rendering on `http://127.0.0.1:8000`

In Storybook, open `Blade/Components` and select a component route from controls.

Optional: point Storybook to another Blade server using:

```sh
STORYBOOK_BLADE_BASE_URL=http://your-host:port npm run storybook:ui
```

## Deployment

The GitHub workflow `.github/workflows/build-and-deploy.yml` supports deployments to different stages using GitHub Environments.

### Configure deploy stages

1. In GitHub, go to **Settings → Environments** for this repository.
2. Create environments for the stages you want to deploy to (for example `stage` and `production`).
3. Add environment **Secrets** for deploy values:
  - `BACKUP_PATH`
  - `DEPLOY_PATH`
  - `DEPLOY_HOST`
  - `DEPLOY_USER`
  - `DEPLOY_KEY`
  - `DEPLOY_PORT`
4. Set environment-specific secret values (`stage` and `production`) so each environment can use separate SSH host/user/port and deploy paths.

### Run deployments

- **Automatic deploys by branch:**
  - push to `stage` deploys to `stage`
  - push to `master` deploys to `production`
- **Stage or production (manual):** run the workflow **Build and deploy styleguide** from the Actions tab and select `deploy_stage` (`stage` or `production`).

Deploy stage controls which GitHub Environment secrets are used (`stage` branch -> `stage`, `master` branch -> `production`, or selected `deploy_stage` for manual runs), so stage and production can use separate SSH configs and deploy paths.

## Design Tokens System

This project uses design tokens as the single source of truth for visual values (spacing, radius, typography, color, shadow). The token system is built to keep component styles consistent while still allowing controlled overrides in consuming implementations.

### Goal

- Keep design decisions centralized and reusable.
- Avoid hardcoded one-off values in component styles.
- Make components themeable at runtime through CSS custom properties.
- Keep the API stable and explicit through JSON schemas and component token declarations.

### Architecture (how it works)

1. **Global tokens source**: `source/data/design-tokens.json`
   - Defines categories and CSS variable defaults.
2. **Generated Sass output**: `source/sass/setting/_design-tokens.scss`
   - Auto-generated from the JSON file by:
   ```sh
   npm run tokens
   ```
3. **Component token declaration**: `source/components/<component>/component.json`
  - Each component lists which global tokens it is allowed to consume in its `tokens` array.
  - Vite still supports the legacy `source/data/c-*.json` lookup as a fallback, but new component work should use the component-local `component.json` file.
4. **Build-time token injection**: `vite.config.mjs`
  - Exposes a custom Sass function `getComponentTokens($name)` that reads token arrays from `source/components/<component>/component.json`.
5. **Component-scoped token mapping**: `source/sass/mixin/_tokens.scss`
   - `@include tokens.create(...)` maps global tokens (`--color--surface`) to component-scoped tokens (`--c-card--color--surface`).
   - Components then consume these values with `tokens.getRawValue(...)`, `tokens.getCalculatedValue(...)`, or `tokens.getDerivedAliasValue(...)` for derived component aliases.

### Token Helper Functions

- `tokens.getRawValue($prefix, $token)`
  - Reads a raw component token such as color, font family, or border token.
- `tokens.getRawValue($prefix: $_, $token: "color--surface", $inheritVariable: "color-background")`
  - Use this when a real token should resolve as explicit component override -> inherit hook -> token default.
- `tokens.getCalculatedValue($prefix, $token, $multiplier)`
  - Reads a scale-based numeric token and applies the multiplier against `var(--base)`.
- `tokens.getCalculatedValue($prefix: $_, $token: "space", $multiplier: 2, $inheritVariable: "space")`
  - Use this when a scale-based token also needs inherit precedence.
- `tokens.getDefaultRawValue($prefix, $token)`
  - Reads the `-default` token variable emitted by `tokens.create(..., $emitDefaultTokenVariables: true)`.
- `tokens.getDerivedAliasValue($prefix, $variable, $inheritVariable)`
  - Use this for derived component aliases such as `--c-typography--h2-font-size`, where precedence must be explicit alias override -> inherit hook -> alias default.

### Intended Usage

#### 1) Define or update global tokens

Edit `source/data/design-tokens.json` and run:

```sh
npm run tokens
```

This regenerates `source/sass/setting/_design-tokens.scss`.

Example (global token):

```json
{
  "id": "radius",
  "label": "Radius",
  "settings": [
    {
      "variable": "--border-radius",
      "label": "Border Radius",
      "type": "range",
      "default": 1,
      "min": 0,
      "max": 5,
      "step": 0.25
    }
  ]
}
```

#### 2) Declare which tokens a component may consume

Example in `source/components/button/component.json`:

```json
{
  "tokens": [
    "base",
    "border-radius",
    "border-width",
    "space",
    "color--primary",
    "color--surface",
    "shadow"
  ]
}
```

#### 3) Create component-local token aliases in Sass

```scss
@use "../mixin/tokens";

$_: "c-example";

@include tokens.create($_, getComponentTokens($_));

.c-example {
  border-radius: tokens.getCalculatedValue($_, "border-radius");
  background: tokens.getRawValue($_, "color--surface");
  color: tokens.getRawValue($_, "color--surface-contrast");
  filter: tokens.getCalculatedValue($_, "shadow", 2);
  padding: tokens.getCalculatedValue($_, "space", 2);
}
```

Derived alias example:

```scss
@use "../mixin/tokens";

$_: "c-typography";

@include tokens.create($prefix: $_, $tokens: getComponentTokens($_), $emitDefaultTokenVariables: true);

:root {
  --#{$_}--font-size-lead-default: #{tokens.getRawValue($_, "font-size-200")};
}

.#{$_}__variant--lead {
  font-size: tokens.getDerivedAliasValue($_, "font-size-lead", "font-size");
}
```

#### 4) Override tokens in implementation (theme or local instance)

Global theme override:

```css
:root {
  --color--primary: #0052cc;
  --color--primary-contrast: #ffffff;
  --border-radius: 0.75;
}
```

Component instance override:

```css
.c-card--campaign {
  --c-card--color--surface: #111827;
  --c-card--color--surface-contrast: #f9fafb;
  --c-card--border-radius: 1.5;
}
```

Runtime override with JavaScript:

```js
const card = document.querySelector('.c-card');
card?.style.setProperty('--c-card--color--surface', '#1f2937');
```

### Architectural Flexibility

- **Scoped customization**: The same component can have different appearances by overriding `--c-<component>--*` per instance.
- **Global theming**: Change `:root` token values to update all components consistently.
- **Explicit token mapping only** in `tokens.create(...)`:
  - Every consumed token must be listed in the component token manifest.
  - Companion tokens such as `-border` and `-alt` must be declared in global tokens and referenced explicitly.
  - Shadow internals (`shadow-color`, `shadow-amount`) must be listed directly.

### Architectural Limitations (important)

- **Do not edit generated token Sass directly**:
  - `source/sass/setting/_design-tokens.scss` is generated and overwritten.
- **Allowed token names are schema-driven**:
  - Component token arrays are validated against `source/design-tokens-schema.json` enum values.
- **Component must declare tokens it consumes**:
  - If a token is missing from `source/components/<component>/component.json`, it will not be mapped by `tokens.create(...)`.
- **`tokens.getCalculatedValue(...)` assumes scale-based numeric usage**:
  - It returns `calc(var(--c-...--token) * var(--base) * multiplier)` (except special cases like `base` and `shadow`).
  - For raw values or non-scale tokens, use `tokens.getRawValue(...)`.
- **Use `tokens.getDerivedAliasValue(...)` for derived component aliases**:
  - This applies when the runtime variable is not itself a token, but a component alias such as `--c-typography--h2-font-size`.
  - Keep the `-default` alias variable token-only, and apply inherit precedence at the usage site.
- **No implicit companion generation**:
  - Token behavior is declarative; add companion tokens explicitly in token JSON and component manifests.

### Recommended Workflow

1. Add/update token definitions in `source/data/design-tokens.json`.
2. Run `npm run tokens`.
3. Add token usage list in `source/components/your-component/component.json`.
4. Consume via `@include tokens.create($_, getComponentTokens($_));` in component Sass.
5. Use `tokens.getRawValue(...)` and `tokens.getCalculatedValue(...)` in styles.
6. Validate by running watch/build and checking component previews.

### Global Token Reference

The base token surface lives in `source/data/design-tokens.json`. These are the system-level tokens that components consume through `tokens.create(...)`.

In the tables below, `Can the user manipulate it?` means the supported direct customization path in the token source and design-token UI. Tokens marked `No` are locked or derived tokens and should normally be changed indirectly by editing their upstream inputs. They can still be overridden in raw CSS if absolutely necessary, but that is not the intended primary workflow.

#### Base

| Token | Purpose | How it is derived | Can the user manipulate it? |
| --- | --- | --- | --- |
| `--base` | Foundation unit for spacing, size, and radius calculations across the system. | Defaults to `calc(1rem/2)`. Locked because it is a system baseline rather than a regular theme knob. | No, not as a primary UI/token-source control. Change indirectly through root sizing or raw CSS only if the whole system baseline must move. |
| `--base-font-size` | Root type size that drives the type scale. | Defaults to `16px` with a `18px` option. All computed font-size tokens derive from it. | Yes. |

#### Layout

| Token | Purpose | How it is derived | Can the user manipulate it? |
| --- | --- | --- | --- |
| `--container-width-multiplier` | Controls the main content width scale. | Direct numeric token. Default `160`. | Yes. |
| `--container-width` | Final container width token used by layouts. | Derived as `calc(var(--base) * var(--container-width-multiplier))`. | No. Change `--container-width-multiplier` or `--base` instead. |
| `--container-width-wide-multiplier` | Controls how much wider the wide container is than the default container. | Direct numeric token. Default `1.25`. | Yes. |
| `--container-width-wide` | Final wide-container width token. | Derived as `calc(var(--container-width) * var(--container-width-wide-multiplier))`. | No. Change `--container-width-wide-multiplier` or upstream container tokens instead. |

#### Radius

| Token | Purpose | How it is derived | Can the user manipulate it? |
| --- | --- | --- | --- |
| `--border-radius` | Radius scale input used by components for rounded corners. | Direct numeric token. Default `1`. Components usually multiply it by `--base`. | Yes. |
| `--corner-shape` | Controls the corner rendering mode where `corner-shape` is used. | Direct select token. Default `round`. | Yes. |

#### Typography

| Token | Purpose | How it is derived | Can the user manipulate it? |
| --- | --- | --- | --- |
| `--font-family-base` | Default body font family. | Direct font token. Default `"Roboto", sans-serif`. | Yes. |
| `--font-family-heading` | Heading font family. | Defaults to `var(--font-family-base)`, so it inherits the body font unless explicitly changed. | Yes. |
| `--font-family-code` | Monospace/code font family. | Direct token with a fixed default stack. Marked locked. | No, not through the intended token UI flow. |
| `--font-size-scale-ratio` | Ratio used to generate the full font-size scale. | Direct select token. Default `1.250`. | Yes. |
| `--font-weight-normal` | Default text weight. | Direct select token. Default `400`. | Yes. |
| `--font-weight-medium` | Medium emphasis font weight. | Direct select token. Default `500`. | Yes. |
| `--font-weight-bold` | Strong emphasis font weight. | Direct select token. Default `700`. | Yes. |
| `--font-weight-heading` | Default heading weight. | Direct select token. Default `700`. | Yes. |
| `--line-height-base` | Default body line height. | Direct numeric token. Default `1.625`. | Yes. |
| `--line-height-heading` | Default heading line height. | Direct numeric token. Default `1.33`. | Yes. |
| `--letter-spacing-base` | Default text letter spacing. | Direct numeric token. Default `0em`. | Yes. |

#### Font Sizes

| Token | Purpose | How it is derived | Can the user manipulate it? |
| --- | --- | --- | --- |
| `--font-size-80` | Two steps below the base type size. | Derived as `calc(var(--base-font-size) * pow(var(--font-size-scale-ratio), -2))`. | No. Change `--base-font-size` or `--font-size-scale-ratio` instead. |
| `--font-size-90` | One step below the base type size. | Derived as `calc(var(--base-font-size) * pow(var(--font-size-scale-ratio), -1))`. | No. Change `--base-font-size` or `--font-size-scale-ratio` instead. |
| `--font-size-100` | Base type size token. | Derived as `var(--base-font-size)`. | No. Change `--base-font-size` instead. |
| `--font-size-200` | One step above the base type size. | Derived as `calc(var(--base-font-size) * pow(var(--font-size-scale-ratio), 1))`. | No. Change `--base-font-size` or `--font-size-scale-ratio` instead. |
| `--font-size-300` | Two steps above the base type size. | Derived as `calc(var(--base-font-size) * pow(var(--font-size-scale-ratio), 2))`. | No. Change `--base-font-size` or `--font-size-scale-ratio` instead. |
| `--font-size-400` | Three steps above the base type size. | Derived as `calc(var(--base-font-size) * pow(var(--font-size-scale-ratio), 3))`. | No. Change `--base-font-size` or `--font-size-scale-ratio` instead. |
| `--font-size-500` | Four steps above the base type size. | Derived as `calc(var(--base-font-size) * pow(var(--font-size-scale-ratio), 4))`. | No. Change `--base-font-size` or `--font-size-scale-ratio` instead. |
| `--font-size-600` | Five steps above the base type size. | Derived as `calc(var(--base-font-size) * pow(var(--font-size-scale-ratio), 5))`. | No. Change `--base-font-size` or `--font-size-scale-ratio` instead. |
| `--font-size-700` | Six steps above the base type size. | Derived as `calc(var(--base-font-size) * pow(var(--font-size-scale-ratio), 6))`. | No. Change `--base-font-size` or `--font-size-scale-ratio` instead. |
| `--font-size-800` | Seven steps above the base type size. | Derived as `calc(var(--base-font-size) * pow(var(--font-size-scale-ratio), 7))`. | No. Change `--base-font-size` or `--font-size-scale-ratio` instead. |

#### Borders

| Token | Purpose | How it is derived | Can the user manipulate it? |
| --- | --- | --- | --- |
| `--border-width` | Base border width token for UI elements. | Direct numeric token. Default `0.125`. | Yes. |
| `--color--border-mix-amount` | Mix ratio used when generating derived `*-border` companion colors. | Direct percentage token. Default `10%`. | Yes. |

#### Spacing

| Token | Purpose | How it is derived | Can the user manipulate it? |
| --- | --- | --- | --- |
| `--space` | Standard internal spacing token for paddings and margins inside components. | Direct numeric token. Default `1`. | Yes. |
| `--outer-space` | Spacing token for gaps between components or outer layout rhythm. | Direct numeric token. Default `1`. | Yes. |

#### Shadows

| Token | Purpose | How it is derived | Can the user manipulate it? |
| --- | --- | --- | --- |
| `--shadow-color` | Base color used by shadow formulas. | Direct RGBA token. Default `rgba(0, 0, 0, 0.1)`. | Yes. |
| `--shadow-amount` | Global multiplier for shadow intensity. | Direct numeric token. Default `0.7`. Components typically combine it with `--base` in shadow calculations. | Yes. |

#### Brand Colors

| Token | Purpose | How it is derived | Can the user manipulate it? |
| --- | --- | --- | --- |
| `--color--primary` | Main brand/action color. | Direct color token. Default `#2d2d2d`. | Yes. |
| `--color--primary-contrast` | Text/icon color on top of primary backgrounds. | Direct color token. Default `#ffffff`. | Yes. |
| `--color--primary-border` | Border/emphasis companion for primary surfaces. | Derived as `color-mix(in srgb, var(--color--primary-contrast) var(--color--border-mix-amount), var(--color--primary))`. | No. Change `--color--primary`, `--color--primary-contrast`, or `--color--border-mix-amount` instead. |
| `--color--primary-alt` | Softer alternate primary surface. | Derived as `color-mix(in srgb, var(--color--primary-contrast) var(--color--alt-mix-amount), var(--color--primary))`. | No. Change `--color--primary`, `--color--primary-contrast`, or `--color--alt-mix-amount` instead. |
| `--color--secondary` | Secondary brand color. | Direct color token. Default `#6e6e6e`. | Yes. |
| `--color--secondary-contrast` | Text/icon color on top of secondary backgrounds. | Direct color token. Default `#ffffff`. | Yes. |
| `--color--secondary-border` | Border/emphasis companion for secondary surfaces. | Derived as `color-mix(in srgb, var(--color--secondary-contrast) var(--color--border-mix-amount), var(--color--secondary))`. | No. Change `--color--secondary`, `--color--secondary-contrast`, or `--color--border-mix-amount` instead. |
| `--color--secondary-alt` | Softer alternate secondary surface. | Derived as `color-mix(in srgb, var(--color--secondary-contrast) var(--color--alt-mix-amount), var(--color--secondary))`. | No. Change `--color--secondary`, `--color--secondary-contrast`, or `--color--alt-mix-amount` instead. |

#### Layout Colors

| Token | Purpose | How it is derived | Can the user manipulate it? |
| --- | --- | --- | --- |
| `--color--alt-mix-amount` | Mix ratio used when generating `*-alt` surface colors. | Direct percentage token. Default `4%`. | Yes. |
| `--color--background` | Main page/application background color. | Direct color token. Default `#f5f5f5`. | Yes. |
| `--color--background-contrast` | Foreground color for content on background surfaces. | Direct color token. Default `#2d2d2d`. | Yes. |
| `--color--background-contrast-muted` | Muted foreground for background surfaces. | Derived as `color-mix(in srgb, var(--color--background-contrast) 67.5%, var(--color--background))`. | No. Change `--color--background` or `--color--background-contrast` instead. |
| `--color--background-border` | Border/emphasis companion for background surfaces. | Derived as `color-mix(in srgb, var(--color--background-contrast) var(--color--border-mix-amount), var(--color--background))`. | No. Change `--color--background`, `--color--background-contrast`, or `--color--border-mix-amount` instead. |
| `--color--surface` | Default elevated/content surface color. | Direct color token. Default `#ffffff`. | Yes. |
| `--color--surface-contrast` | Foreground color for content on surface backgrounds. | Direct color token. Default `#2d2d2d`. | Yes. |
| `--color--surface-contrast-muted` | Muted foreground for surface backgrounds. | Derived as `color-mix(in srgb, var(--color--surface-contrast) 67.5%, var(--color--surface))`. | No. Change `--color--surface` or `--color--surface-contrast` instead. |
| `--color--surface-border` | Border/emphasis companion for surface elements. | Derived as `color-mix(in srgb, var(--color--surface-contrast) var(--color--border-mix-amount), var(--color--surface))`. | No. Change `--color--surface`, `--color--surface-contrast`, or `--color--border-mix-amount` instead. |
| `--color--surface-alt` | Softer alternate surface color. | Derived as `color-mix(in srgb, var(--color--surface-contrast-muted) var(--color--alt-mix-amount), var(--color--surface))`. | No. Change `--color--surface`, `--color--surface-contrast`, or `--color--alt-mix-amount` instead. |

#### UI Colors

| Token | Purpose | How it is derived | Can the user manipulate it? |
| --- | --- | --- | --- |
| `--color--focus` | Focus ring and focus state color. | Direct color token. Default `#4d90fe`. | Yes. |
| `--color--alpha` | Overlay color including opacity. | Direct RGBA token. Default `rgba(0, 0, 0, 0.1)`. | Yes. |
| `--color--alpha-contrast` | Foreground color on top of alpha overlays. | Direct color token. Default `#ffffff`. | Yes. |
| `--color--alpha-border` | Border/emphasis companion for alpha overlays. | Derived as `color-mix(in srgb, var(--color--alpha-contrast) var(--color--border-mix-amount), var(--color--alpha))`. | No. Change `--color--alpha`, `--color--alpha-contrast`, or `--color--border-mix-amount` instead. |

#### State Colors

| Token | Purpose | How it is derived | Can the user manipulate it? |
| --- | --- | --- | --- |
| `--color--success` | Success state background/accent color. | Direct color token. Default `#4caf50`. | Yes. |
| `--color--success-contrast` | Foreground color for success surfaces. | Direct color token. Default `#ffffff`. | Yes. |
| `--color--success-border` | Border/emphasis companion for success surfaces. | Derived as `color-mix(in srgb, var(--color--success-contrast) var(--color--border-mix-amount), var(--color--success))`. | No. Change `--color--success`, `--color--success-contrast`, or `--color--border-mix-amount` instead. |
| `--color--warning` | Warning state background/accent color. | Direct color token. Default `#ffb300`. | Yes. |
| `--color--warning-contrast` | Foreground color for warning surfaces. | Direct color token. Default `#2d2d2d`. | Yes. |
| `--color--warning-border` | Border/emphasis companion for warning surfaces. | Derived as `color-mix(in srgb, var(--color--warning-contrast) var(--color--border-mix-amount), var(--color--warning))`. | No. Change `--color--warning`, `--color--warning-contrast`, or `--color--border-mix-amount` instead. |
| `--color--danger` | Danger/error state background/accent color. | Direct color token. Default `#e53935`. | Yes. |
| `--color--danger-contrast` | Foreground color for danger surfaces. | Direct color token. Default `#ffffff`. | Yes. |
| `--color--danger-border` | Border/emphasis companion for danger surfaces. | Derived as `color-mix(in srgb, var(--color--danger-contrast) var(--color--border-mix-amount), var(--color--danger))`. | No. Change `--color--danger`, `--color--danger-contrast`, or `--color--border-mix-amount` instead. |
| `--color--info` | Informational state background/accent color. | Direct color token. Default `#039be5`. | Yes. |
| `--color--info-contrast` | Foreground color for info surfaces. | Direct color token. Default `#ffffff`. | Yes. |
| `--color--info-border` | Border/emphasis companion for info surfaces. | Derived as `color-mix(in srgb, var(--color--info-contrast) var(--color--border-mix-amount), var(--color--info))`. | No. Change `--color--info`, `--color--info-contrast`, or `--color--border-mix-amount` instead. |

### Related Files

- `source/data/design-tokens.json` (global token source)
- `build-design-tokens.mjs` (JSON -> generated Sass compiler)
- `source/sass/setting/_design-tokens.scss` (generated root CSS vars)
- `source/sass/mixin/_tokens.scss` (token API for components)
- `source/components/*/component.json` (component token whitelists)
- `source/design-tokens-schema.json`, `source/component-schema.json`, and `source/utility-schema.json` (validation/contracts)

## Testing

Playwright component customizer panel testing rules and coverage requirements are documented in [playwright.md](./playwright.md).

### Contribution Rule-Set (Do and Don't)

The rules below are aligned with the validator tests in `source/validators/Tests` and should be followed for all component and style changes.

#### Do

- **Do use design tokens as the source of truth** in component styles.
- **Do declare component token usage** in `source/components/<component>/component.json`.
- **Do namespace component CSS custom properties** so they remain component-scoped.
- **Do declare each `--inherit-*` variable with `@property` and `inherits: false`** when used.
- **Do keep JavaScript tests adjacent to the file under test** (`*.test.ts` / `*.test.js`).
- **Do run validator and unit tests before opening a PR**.

#### Don't

- **Don't use Sass variables in component SCSS**, except the allowed component name variable `$_` in token helper calls.
- **Don't mix token/Sass variable patterns in utility files** that should rely on CSS custom properties.
- **Don't use un-namespaced CSS custom properties** in component SCSS.
- **Don't reference CSS variables that are not declared in design tokens / generated variable sources**.
- **Don't edit generated token output directly** (for example `source/sass/setting/_design-tokens.scss`), as it will be overwritten.

#### When A Component Affects Another Component

When a component needs to affect the appearance or functionality of an inner component, only two methods are allowed.

##### 1. Inherit Variables

Some components declare `--inherit-*` variables specifically to pass settings down to another component. These variables always take precedence over the receiving component's default values and should be the first choice when the receiving component explicitly supports them.

Example flow:

- Override: [`source/components/segment/text.scss`](./source/components/segment/text.scss#L9-L15)
- Declaration: [`source/components/typography/style.scss`](./source/components/typography/style.scss#L3-L18)
- Implementation: [`source/components/typography/style.scss`](./source/components/typography/style.scss#L81-L115)

##### 2. Direct Component Targeting

Direct targeting may be used for smaller modifications, especially when the affected property is not exposed through an inherit variable. This is only allowed for outer-context adaptation on the outermost element of the inner component.

Example:

- [`source/components/block/style.scss`](./source/components/block/style.scss#L131-L138)

#### Test-Backed Rules (Source of Truth)

- `source/validators/Tests/NoSassVariablesTest.php`
- `source/validators/Tests/TokenMixingTest.php`
- `source/validators/Tests/CssVariablesNamespacedTest.php`
- `source/validators/Tests/CssVariablesReferencesDesignTokensTest.php`
- `source/validators/Tests/InheritVariablesDeclaredTest.php`

#### Quick Verification Before PR

```sh
# PHP validator tests (SCSS/token contracts)
./vendor/bin/phpunit source/validators/Tests

# JavaScript unit tests
npm test
```

Jest is used as testing framework for JavaScript in the StyleGuide.

Test files should be added adjacent to the file that is the subject fo testing. Naming convention for test files is to use the same name as the file that is subject for testing and be appended with ".test.js" or "test.ts". The ".ts" file ending enables some IDE's, like VS Code, to add intellisense for Jest.

### Example file accompanied by test file
```
source/js
├── gallery.js
├── gallery.test.ts
```

### Test scripts
* Run tests:
  ```sh
  npm test
  ```
* Runs tests in file watch mode:
  ```sh
  npm run test:dev
  ```

## VS Code Devcontainer & Codespaces
Configuration for Codespaces is available and to get it up and running do the following after opening a Codespace:
1. Run task `Setup`.
1. Run task `Serve`.

## License
Distributed under the [MIT License][license-url].


## Acknowledgements
- [othneildrew Best README Template](https://github.com/othneildrew/Best-README-Template)


<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/helsingborg-stad/styleguide.svg?style=flat-square
[contributors-url]: https://github.com/helsingborg-stad/styleguide/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/helsingborg-stad/styleguide.svg?style=flat-square
[forks-url]: https://github.com/helsingborg-stad/styleguide/network/members
[stars-shield]: https://img.shields.io/github/stars/helsingborg-stad/styleguide.svg?style=flat-square
[stars-url]: https://github.com/helsingborg-stad/styleguide/stargazers
[issues-shield]: https://img.shields.io/github/issues/helsingborg-stad/styleguide.svg?style=flat-square
[issues-url]: https://github.com/helsingborg-stad/styleguide/issues
[license-shield]: https://img.shields.io/github/license/helsingborg-stad/styleguide.svg?style=flat-square
[license-url]: https://raw.githubusercontent.com/helsingborg-stad/styleguide/master/LICENSE
