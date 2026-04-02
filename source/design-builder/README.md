# Design Builder

Complete documentation for the Design Builder runtime and component-level customization tool.

## Overview

The Design Builder runtime has two execution modes in the same entry file:

1. Full page mode (route: /design-builder)
2. Component page mode (global docs pages with customize assets loaded)

Entry file:
- source/design-builder/index.ts

Styles:
- source/design-builder/design-builder.scss

Control rendering entry:
- source/design-builder/controls.ts

Control rendering modules:
- source/design-builder/controls/layout/*
- source/design-builder/controls/shared/*
- source/design-builder/controls/types.ts

Global token/preset storage helpers (full page mode):
- source/design-builder/storage.ts

## Mode 1: Full page Design Builder

### Activation

Full page mode starts when the DOM contains:
- [data-design-builder]

The container must also include:
- data-tokens="...json..."

Template source:
- views/pages/design-builder.blade.php

### Behavior

- Renders categorized controls from source/data/design-tokens.json payload.
- Applies token overrides directly on :root.
- Persists overrides in localStorage.
- Supports:
  - reset all
  - import/export JSON
  - presets (save/load/delete)
  - optional display of locked fields
  - draggable split between controls and preview

### Storage keys (full page mode)

From source/design-builder/storage.ts and source/design-builder/index.ts:

- design-tokens-overrides
- design-tokens-presets
- design-tokens-active-preset
- design-builder-split

## Mode 2: Component-level customization

### Activation

Component mode starts when:

1. No [data-design-builder] container is found, and
2. window.styleguideCustomizeData exists, and
3. window.styleguideDesignTokenLibrary exists and is valid

Init mode is controlled by:
- window.styleguideCustomizeInitMode = "onload" | "manual"

Behavior:
- onload: component customizer initializes automatically
- manual: waits for click on [data-customize-init-fab]

Styleguide default:
- manual mode via views/layout/master.blade.php

Theme / WP customizer usage:
- set window.styleguideCustomizeInitMode = "onload" before loading design-builder script

Payloads are injected in:
- views/layout/master.blade.php

Payloads are produced by:
- source/php/Customize/CustomizeAssets.php

### Component discovery

Targets are discovered by:
- [data-component]

Targets are skipped when they are inside:
- [data-customizable="false"]

This excludes the marked component and all nested [data-component] descendants.

Examples:
- data-component="button"
- data-component="typography"

Component names are normalized to lowercase and c- prefix is removed.

### Editable determination

A component is editable when:
- It appears in styleguideCustomizeData, and
- It has declared tokens that can be matched against token library categories/settings.

### Floating customizer panel

Rendered as:
- .db-component-tool

Features:
- Open/close panel
- Select editable component
- Reset selected component (current scope only)
- Reset all components (all scopes)
- Render controls for mapped token categories

### UX behaviors on editable targets

Editable targets get:

- Hover affordance
- Active selection highlight
- Tooltip text
  - "Customize [Component Name]"
  - If scoped: "Customize [Component Name] ([scope])"
- Link click prevention inside editable targets
  - Prevents accidental navigation while customizing

## Scopes

### Scope attribute

Scoped behavior is enabled via:
- data-scope="your-scope-name"

Scope resolution is nearest ancestor based:
- For a clicked/updated target, closest ancestor [data-scope] is used.
- If no scope ancestor exists, runtime uses global scope.

Internal global scope key:
- __global__

Internal named scope key format:
- scope:your-scope-name

### Scope effect

For component-level mode, token changes apply only to elements where:

- data-component matches selected component, and
- resolved scope key matches the active scope key

This allows same component type to be customized differently per context.

Example:

- Typography inside Paper with data-scope="content-card"
- Typography inside Hero with data-scope="hero"

Changes in one scope do not affect the other.

## Storage model (component-level mode)

Storage key:
- design-tokens-component-overrides

Current shape:

{
  "__global__": {
    "button": {
      "--c-button--color--primary": "#0055aa"
    }
  },
  "scope:content-card": {
    "typography": {
      "--c-typography--font-size-200": "1.125rem"
    }
  }
}

### Legacy migration

Legacy unscoped saved data is still accepted.
If old shape is detected (component -> variables), runtime migrates it in-memory to:

- __global__ -> component -> variables

and continues with scoped model.

## Data contracts

### styleguideCustomizeData

Source file generated at project root:
- component-design-tokens.json

Injected as:
- window.styleguideCustomizeData

Contains per-component metadata, including token names used to map editable controls.

### styleguideDesignTokenLibrary

Source file:
- source/data/design-tokens.json

Injected as:
- window.styleguideDesignTokenLibrary

Contains categories and settings used to render controls.

### Important

Component-level mode is DOM payload driven.
No fetch fallback is used for token library in current implementation.

## Token mapping logic in component mode

For selected component "button" and token "color--primary":

- Token variable from library (base): --color--primary
- Localized variable applied to component target: --c-button--color--primary

Rendered controls are grouped by token category from token library.

## Server integration

CustomizeAssets::get() returns:

- script
- style
- data
- tokenLibrary

References:
- source/php/Customize/CustomizeAssets.php
- source/php/Tests/CustomizeAssetsTest.php

## Styling notes

Component-level tool and target styles live in:
- source/design-builder/design-builder.scss

Relevant class groups:

- .db-component-tool*
- .db-component-target
- .db-component-target--active

## Development workflow

Typical commands:

- npm run tokens
- npm run watch
- npm run build

Build generates:

- assets/dist/js/design-builder.js
- assets/dist/css/design-builder.css

## Adding or extending functionality

### Add new token control behavior

- Add or update layout components in source/design-builder/controls/layout/
- Add or update shared helpers in source/design-builder/controls/shared/
- Keep source/design-builder/controls.ts as thin composition/adapter entry
- Ensure source/data/design-tokens.json has correct type/options metadata

### Add new customizable component

- Ensure component has data-component in rendered markup
- Ensure component exists in component-design-tokens.json
- Ensure referenced tokens exist in source/data/design-tokens.json

### Add scoped example context

Wrap region with:

- data-scope="my-scope"

Any data-component targets inside that region become scope-bound for apply/reset.

## Troubleshooting

### Component panel does not show

Check:

- customize assets script/style loaded in layout
- window.styleguideCustomizeData exists
- window.styleguideDesignTokenLibrary exists
- page has at least one editable [data-component]

### Component not selectable

Check:

- data-component value matches component key or slug normalization
- Component has token list in component-design-tokens.json
- Tokens are present in design token library categories/settings

### Setting does not apply

Check:

- Selected target scope context matches expected data-scope
- Variable exists for component token mapping
- Component CSS consumes localized variable (for example --c-button--...)

### Nested components select wrong target

Current behavior chooses clicked target and stops propagation.
If selection still feels wrong, verify nested markup and where data-component is placed.

## Current limitations

- Scope selector has a single General (all scopes) option plus detected named scopes per component context.
- Component dropdown is component-first, with scope options based on where that component exists on the page.
- Component-level mode focuses on direct editable targets marked with data-component.
- Wrapper components used for scoping (scope/divider alias) are excluded from component customization.

## Suggested future improvements

- Add breadcrumb for selected target path (component + scope)
- Add per-scope export/import
- Add optional keyboard navigation for target picking
