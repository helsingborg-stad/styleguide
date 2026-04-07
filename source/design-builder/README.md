# Design Builder

Complete documentation for the Design Builder runtime and component-level customization tool.

## Overview

The runtime is now bootstrapped through a root web component:
- `<design-builder>`

Root element contract:
- `mode`: optional legacy/manual override for `full-page` or `component-customizer`
- `token-data`: JSON payload used in `full-page` mode
- `token-library`: JSON payload used in `component-customizer` mode
- `component-data`: JSON payload used in `component-customizer` mode
- `override-state`: optional JSON payload used to hydrate draft token/component overrides
- `config`: JSON object for mode-specific options
  - `initMode`: `onload` or `manual` for `component-customizer`
  - `customizerContainerSelector`: optional CSS selector for host-provided customizer mount container

Root element runtime API:
- `mode`
- `config`
- `tokenData`
- `tokenLibraryData`
- `componentData`
- `overrideState`
- `switchMode(mode)`

Root element events:
- `design-builder:initialized`
- `design-builder:save`
- `design-builder:error`

The Design Builder runtime has two execution modes in the same entry file:

1. Full page mode (route: /design-builder)
2. Component page mode (global docs pages with customize assets loaded)

Entry file:
- source/design-builder/index.ts

Styles:
- source/design-builder/design-builder.css

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
- `<design-builder token-data="...json...">`

Optional legacy/manual override:
- `<design-builder mode="full-page" token-data="...json...">`

Legacy compatibility is preserved for older markup:
- `[data-design-builder]`
- `data-tokens="...json..."`

Template source:
- views/pages/design-builder.blade.php

### Behavior

- Renders categorized controls from source/data/design-tokens.json payload.
- Applies token overrides directly on `:root`.
- Keeps draft overrides on the root element until the user explicitly clicks **Save**.
- Supports:
  - reset all
  - import/export JSON
  - presets (save/load/delete)
  - explicit save event emission
  - optional display of locked fields
  - draggable split between controls and preview

### Storage keys

Used by the styleguide host integration and shared preset helpers:

- design-builder-overrides
- design-builder-presets
- design-builder-active-preset
- design-builder-split

The generic `<design-builder>` element no longer writes to localStorage while the user edits. In the styleguide app, `source/design-builder/app/rootElement.ts` hydrates `override-state` from storage and listens for `design-builder:save` to persist the current override document.

## Mode 2: Component-level customization

### Activation

Component mode starts when either:

1. A `<design-builder>` root with component payloads exists, or
2. No full-page design builder root is found, and
3. window.styleguideCustomizeData exists, and
4. window.styleguideDesignTokenLibrary exists and is valid

If only payload globals are present, runtime auto-creates a hidden `<design-builder>` root and hydrates it from:
- window.styleguideCustomizeData
- window.styleguideDesignTokenLibrary

Legacy full-page container detection (`[data-design-builder]`) still works and prevents component-mode auto bootstrap.

Init mode is controlled by:
- window.styleguideCustomizeInitMode = "onload" | "manual"

Behavior:
- onload: component customizer initializes automatically
- manual: waits for click on `[data-customize-init-fab]`

When both full-page and component-customizer payloads are available, Design Builder renders an internal mode switcher so the active experience can be changed from inside the component.

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
- `.db-builder.db-builder-customizer`

Placement is root-controlled by default:
- When an explicit `<design-builder>` root is present, the customizer UI renders inside that root so mode switching can happen within the component.
- A host-provided `customizerContainerSelector` can still override the mount target.
- Hidden auto-created roots continue to fall back to an external host container.

Features:
- Open/close panel
- Select editable component
- Manually activate page-picking to choose a component by clicking it on the page
- Save/load/delete shared presets that include both token and component overrides
- Import/export component override JSON
- Emit an explicit save event with the full override document
- Reset selected component (current scope only)
- Reset all components (all scopes)
- Render controls for mapped token categories

### UX behaviors on editable targets

Editable targets get:

- Hover affordance when page-picking is manually activated
- Active selection highlight
- Tooltip text while page-picking is active
  - "Customize [Component Name]"
  - If scoped: "Customize [Component Name] ([scope])"
- Link click prevention inside editable targets
  - Prevents accidental navigation while page-picking is active

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

## Override state and save boundary

Both modes share the same override document and mutate different slices of it in memory on the root element.
On startup, the runtime reapplies both slices so token and component overrides are active regardless of which mode is currently open.

Draft state is passed in through `override-state` / `rootElement.overrideState`.

Current shape:

{
  "token": {
    "--color--primary": "#0055aa"
  },
  "component": {
    "__general__": {
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
}

When the user clicks **Save**, the active runtime emits:

```js
new CustomEvent('design-builder:save', {
  detail: {
    mode: 'full-page' | 'component-customizer',
    state: rootElement.overrideState
  },
  bubbles: true,
  composed: true
})
```

This lets hosts decide how persistence works:

- write to localStorage
- POST to an API
- sync to WordPress / another CMS
- ignore save entirely and keep Design Builder draft-only

### Legacy migration

Legacy flat token overrides and legacy component-only saved data are still accepted and migrated into the shared override document in-memory.

### Styleguide host behavior

The styleguide bootstrap in `source/design-builder/app/rootElement.ts` preserves current site behavior by:

- hydrating `override-state` from `LocalStorageAdapter` and `ComponentStorageAdapter` when the attribute is missing
- listening for `design-builder:save`
- writing token and component slices back through those adapters

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

Component-level styles are split into:
- source/design-builder/design-builder.css (shadow-root/internal UI styles)
- source/design-builder/design-builder-external.css (intentional global target highlighting)

Relevant class groups:

- `.db-builder*`
- `.db-component-target`
- `.db-component-target-active`

## Development workflow

Typical commands:

- npm run tokens
- npm run watch
- npm run build

Build generates:

- assets/dist/js/design-builder.js
- assets/dist/css/design-builder.css
- assets/dist/css/design-builder-external.css

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

### Save does nothing

Check:

- the host listens for `design-builder:save`, or uses the styleguide bootstrap that binds the default localStorage save adapter
- the root has a valid `override-state` or has produced draft changes before save
- custom hosts do not replace the root element before reading the event

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
