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
3. **Component token declaration**: `source/data/c-*.json`
   - Each component lists which global tokens it is allowed to consume in its `tokens` array.
4. **Build-time token injection**: `vite.config.mjs`
   - Exposes a custom Sass function `getComponentTokens($name)` that reads token arrays from `source/data/{name}.json`.
5. **Component-scoped token mapping**: `source/sass/mixin/_tokens.scss`
   - `@include tokens.create(...)` maps global tokens (`--color--surface`) to component-scoped tokens (`--c-card--color--surface`).
   - Components then consume these values with `tokens.get(...)` or `tokens.use(...)`.

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

Example in `source/data/c-button.json`:

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
  border-radius: tokens.use($_, "border-radius");
  background: tokens.get($_, "color--surface");
  color: tokens.get($_, "color--surface-contrast");
  filter: tokens.use($_, "shadow", 2);
  padding: tokens.use($_, "space", 2);
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
- **Auto-derived companion values** in `tokens.create(...)`:
  - `border-radius` also maps `corner-shape`.
  - `color--*` automatically gets `-contrast`, `-border`, and `-alt` companions.
  - `shadow` maps to grouped shadow internals (`shadow-color`, `shadow-color-opacity`, `shadow-amount`).
- **Extras/remapping support**:
  - `tokens.create($prefix, $tokens, $extras, $inner)` supports computed extras and child-token remapping when needed.

### Architectural Limitations (important)

- **Do not edit generated token Sass directly**:
  - `source/sass/setting/_design-tokens.scss` is generated and overwritten.
- **Allowed token names are schema-driven**:
  - Component token arrays are validated against `source/design-tokens-schema.json` enum values.
- **Component must declare tokens it consumes**:
  - If a token is missing from `source/data/c-<component>.json`, it will not be mapped by `tokens.create(...)`.
- **`tokens.use(...)` assumes scale-based numeric usage**:
  - It returns `calc(var(--c-...--token) * var(--base) * multiplier)` (except special cases like `base` and `shadow`).
  - For raw values or non-scale tokens, use `tokens.get(...)`.
- **Auto-derivation rules are opinionated**:
  - Color and shadow companions are generated automatically; custom behavior outside these rules should use `$extras` or explicit properties.

### Recommended Workflow

1. Add/update token definitions in `source/data/design-tokens.json`.
2. Run `npm run tokens`.
3. Add token usage list in `source/data/c-your-component.json`.
4. Consume via `@include tokens.create($_, getComponentTokens($_));` in component Sass.
5. Use `tokens.get(...)` and `tokens.use(...)` in styles.
6. Validate by running watch/build and checking component previews.

### Related Files

- `source/data/design-tokens.json` (global token source)
- `build-design-tokens.mjs` (JSON -> generated Sass compiler)
- `source/sass/setting/_design-tokens.scss` (generated root CSS vars)
- `source/sass/mixin/_tokens.scss` (token API for components)
- `source/data/c-*.json` (component token whitelists)
- `source/design-tokens-schema.json` and `source/component-schema.json` (validation/contracts)

## Testing

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
