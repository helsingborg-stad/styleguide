# Design Builder

Complete documentation for the Design Builder runtime and component-level customization tool.

## Overview

The runtime is now bootstrapped through a root web component:
- `<design-builder>`

Root element contract:

| Attribute | What it should contain | Main purpose |
| --- | --- | --- |
| `token-data` | The token document Design Builder should read from. Shape: `TokenData` (`name`, `version`, `categories[]`). | Global tokens mode (`full-page`) and component customization mode (`component-customizer`) |
| `token-library` | Legacy fallback alias for `token-data`. Same `TokenData` shape. | Backward compatibility only |
| `component-data` | The component-to-token mapping used by the customizer. Shape: `Record<string, { name?, slug?, tokens?[] }>` | Component customization mode (`component-customizer`) |
| `mode` | Optional initial mode. Use `full-page` or `component-customizer` when both payload sets are available and the host should choose the starting view. | Initial mode selection |
| `override-state` | The initial draft state for token and component overrides. | Hydrate initial state in either mode |
| `presets` | Optional provided presets that should be available in the preset picker on first render. Accepts either an array or object map of preset definitions. | Seed host-provided presets in either mode |
| `show-save-button` | Optional boolean-like flag for showing the save action. Defaults to `true`; set to `false`, `0`, `no`, or `off` to hide it. | Hide the built-in save button in either mode |
| `data-design-builder-storage` | Optional persistence mode. Use `local-storage` to opt in to the styleguide's localStorage-backed hydration/save behavior. | Host-controlled persistence opt-in |

Quick mental model:

- `token-data` = the **single token source** for both modes
- `token-library` = the **legacy alias** for older integrations
- `component-data` = the **editable components and their token mappings**
- `mode` = the **initial mode to open when both modes are available**
- `override-state` = the **initial draft state**
- `presets` = the **host-provided preset definitions**
- `show-save-button` = **show or hide the built-in save action**
- `data-design-builder-storage="local-storage"` = **enable the built-in localStorage host adapter**

`token-data` is now the canonical token payload for both modes. `token-library` still accepts the same JSON shape, but only as a deprecated compatibility fallback.

Root element runtime API:
- `tokenData`
- `tokenLibraryData` (legacy alias for `tokenData`)
- `componentData`
- `overrideState`
- `presets`

Root element events:
- `design-builder:initialized`
- `design-builder:action`
- `design-builder:change`
- `design-builder:save`
- `design-builder:reset-all`
- `design-builder:reset-component`
- `design-builder:import`
- `design-builder:export`
- `design-builder:preset-save`
- `design-builder:preset-load`
- `design-builder:preset-delete`
- `design-builder:mode-change`
- `design-builder:split-change`
- `design-builder:error`

The Design Builder runtime has two execution modes in the same entry file:

1. Global tokens mode (`full-page`, route: /design-builder)
2. Component customization mode (`component-customizer`, global docs pages with customize assets loaded)

Entry file:
- source/design-builder/index.ts

Internal architecture:
- source/design-builder/web-component/* - generic `<design-builder>` custom element and root configuration resolution
- source/design-builder/hosts/styleguide/* - styleguide-specific bootstrap, root discovery, legacy DOM normalization, and default save adapter
- source/design-builder/features/full-page-editor/* - global tokens editor mode
- source/design-builder/features/component-customizer/* - component customizer mode
- source/design-builder/shared/* - shared controls, state normalization, presets, persistence helpers, styling, and shared types

Styles:
- source/design-builder/design-builder.css

Control rendering entry:
- source/design-builder/shared/control-elements/createDesignBuilderControls.ts

Control rendering modules:
- source/design-builder/shared/control-elements/controls/layout/*
- source/design-builder/shared/control-elements/controls/*

Global token/preset storage helpers (global tokens mode):
- source/design-builder/shared/persistence/TokenOverrideLocalStorageStore.ts
- source/design-builder/shared/presets/DesignBuilderPresetManager.ts

## Attribute-first usage examples

### Example 1: Global tokens root

```html
<design-builder
  token-data='{"name":"Tokens","version":"1.0.0","categories":[]}'
></design-builder>
```

Use `token-data` when the root exists to edit the global token document itself.

### Example 2: Component customizer root

```html
<design-builder
  mode="component-customizer"
  component-data='{"button":{"name":"Button","tokens":["color--primary"]}}'
  token-data='{"name":"Tokens","version":"1.0.0","categories":[]}'
></design-builder>
```

Use `component-data` + `token-data` together when the root exists to customize components on the page. Add `mode="component-customizer"` when the same root could also boot in full-page mode and the host should start in the component customizer.

### Example 3: Update the root by attributes only

```js
const root = document.querySelector('design-builder');

root?.setAttribute(
  'override-state',
  JSON.stringify({
    token: { '--color--primary': '#0055aa' },
    component: {}
  })
);
```

### Example 4: Provide presets from root attributes

```html
<design-builder
  token-data='{"name":"Tokens","version":"1.0.0","categories":[]}'
  presets='[
    {
      "id": "dark",
      "label": "Dark",
      "token": {
        "--color--primary": "#111111"
      }
    },
    {
      "id": "marketing-hero",
      "label": "Marketing Hero",
      "state": {
        "component": {
          "__general__": {
            "hero": {
              "--c-hero--spacing--top": "6rem"
            }
          }
        }
      }
    }
  ]'
></design-builder>
```

Use `presets` when the host should seed the preset picker with known preset options instead of relying only on user-saved storage-backed presets.

### Example 5: Hide the built-in save button

```html
<design-builder
  token-data='{"name":"Tokens","version":"1.0.0","categories":[]}'
  show-save-button="false"
></design-builder>
```

Use `show-save-button="false"` when the host should keep the runtime interactive but remove the built-in save action. This applies in both global tokens and component customization mode.

### Example 6: Update the root by web component properties

```js
const root = document.querySelector('design-builder');

if (root) {
  root.overrideState = {
    token: { '--color--primary': '#0055aa' },
    component: {}
  };

  root.presets = [
    {
      id: 'dark',
      label: 'Dark',
      state: {
        token: { '--color--primary': '#111111' },
        component: {}
      },
      targets: {
        token: true,
        component: false
      }
    }
  ];
}
```

### Example 7: Listen for actions

```js
const root = document.querySelector('design-builder');

root?.addEventListener('design-builder:action', (event) => {
  const { action, mode, state, metadata } = event.detail;
  console.log(action, mode, state, metadata);
});

root?.addEventListener('design-builder:save', (event) => {
  localStorage.setItem('design-builder-overrides', JSON.stringify(event.detail.state));
});
```

## Mode 1: Global tokens editor (`full-page`)

### Activation

Global tokens mode starts when token data is available on the root:
- preferred: `<design-builder token-data="...json...">`
- legacy fallback: `<design-builder token-library="...json...">`

Legacy compatibility is preserved for older markup:
- `[data-design-builder]`
- `data-tokens="...json..."`

Template source:
- views/pages/design-builder.blade.php

### Behavior

- Renders categorized controls from the token payload.
- Reads that payload from `token-data`, with `token-library` only as a deprecated fallback when `token-data` is missing.
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

Temporary persistence is adapter-driven. The default adapters in the styleguide app still use localStorage, but the runtime-facing contract no longer depends on localStorage directly.

Local storage is **opt-in**. To enable the built-in styleguide storage behavior, set `data-design-builder-storage="local-storage"` on either:

- the `<html>` element to enable it for the full page
- an individual `<design-builder>` root to enable it only for that instance

Relevant adapter entry points:

- `source/design-builder/shared/persistence/DesignBuilderStorageAdapter.ts`
- `source/design-builder/shared/persistence/TokenOverrideLocalStorageStore.ts`
- `source/design-builder/features/component-customizer/persistence/ComponentOverrideLocalStorageStore.ts`
- `source/design-builder/shared/presets/DesignBuilderPresetManager.ts`
- `source/design-builder/features/full-page-editor/DesignBuilderSplitLocalStorageStore.ts`

In the styleguide app, `source/design-builder/hosts/styleguide/resolveStyleguideDesignBuilderRootElements.ts` hydrates `override-state` from the default localStorage-backed adapters and listens for `design-builder:save` to persist the current override document, but only when that opt-in is present.
It also normalizes legacy `data-presets` markup to the modern `presets` attribute when older roots are discovered.
For save button visibility, the styleguide host also normalizes legacy `data-show-save-button` markup to `show-save-button`.

## Mode 2: Component customization (`component-customizer`)

### Activation

Component mode starts when a `<design-builder>` root has both:

1. `component-data`
2. `token-data`

The runtime reads these payloads from root attributes/properties. It no longer depends on `window.*` bootstrap globals for them.

Legacy full-page container detection (`[data-design-builder]`) still works for global tokens markup normalization.

Behavior:
- the component customizer initializes as soon as the root element is connected
- the customizer mounts inside the `<design-builder>` instance where it is declared

When both global-token and component-customizer payloads are available, Design Builder renders an internal mode switcher so the active experience can be changed from inside the component.
Hosts can also choose the initial view explicitly with `mode="full-page"` or `mode="component-customizer"`.

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
- It appears in `component-data`, and
- It has declared tokens that can be matched against token library categories/settings.

### Floating customizer panel

Rendered as:
- `.db-builder.db-builder-customizer`

Placement is root-controlled by default:
- When an explicit `<design-builder>` root is present, the customizer UI renders inside that root so mode switching can happen within the component.

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

Initial draft state is passed in through `override-state` / `rootElement.overrideState`.

`override-state` is the input you use when you want Design Builder to start with preloaded draft values instead of an empty state. On startup, the runtime normalizes that payload and reapplies both slices:

- `token` for global token overrides
- `component` for component-level overrides

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
    action: 'save',
    mode: 'full-page' | 'component-customizer',
    state: rootElement.overrideState,
    metadata: undefined
  },
  bubbles: true,
  composed: true
})
```

All user-triggered state-changing actions also emit:

- a generic `design-builder:action` event
- a specific action event such as `design-builder:reset-all` or `design-builder:preset-load`

Current action names:

- `change`
- `save`
- `reset-all`
- `reset-component`
- `import`
- `export`
- `preset-save`
- `preset-load`
- `preset-delete`
- `mode-change`
- `split-change`

This lets hosts decide how persistence and integrations work:

- write to localStorage
- POST to an API
- sync to WordPress / another CMS
- ignore save entirely and keep Design Builder draft-only

### Legacy migration

Legacy flat token overrides and legacy component-only saved data are still accepted and migrated into the shared override document in-memory.

### Styleguide host behavior

The styleguide bootstrap in `source/design-builder/hosts/styleguide/resolveStyleguideDesignBuilderRootElements.ts` preserves current site behavior by:

- hydrating `override-state` from `TokenOverrideLocalStorageStore` and `ComponentOverrideLocalStorageStore` when the attribute is missing and localStorage persistence has been opted in
- listening for `design-builder:save`
- writing token and component slices back through those adapters when the same opt-in is enabled

## Data contracts

### component-data

Source file generated at project root:
- component-design-tokens.json

Injected as a root attribute/property:
- `component-data`
- `rootElement.componentData`

Contains the component-side lookup table used by the customizer.

Think of it as answering:
- Which components are editable?
- What should each component be called in the UI?
- Which token names does each component expose?

Example:

```json
{
  "button": {
    "name": "Button",
    "tokens": ["color--primary", "spacing--2"]
  }
}
```

### token-library (legacy)

Source file:
- source/data/design-tokens.json

Legacy root attribute/property:
- `token-library`
- `rootElement.tokenLibraryData`

`token-library` is kept only for backward compatibility. New integrations should pass the same payload through `token-data` instead.

Example:

```json
{
  "name": "Tokens",
  "version": "1.0.0",
  "categories": [
    {
      "id": "color",
      "label": "Color",
      "settings": []
    }
  ]
}
```

### token-data

`token-data` is the canonical `TokenData` payload for both modes:

- in `full-page`, it is the token document the editor renders and edits
- in `component-customizer`, it is the token catalog used to build controls and resolve token metadata

### presets

Injected as a root attribute/property:
- `presets`
- `rootElement.presets`

Contains host-provided preset definitions that should be shown together with runtime-managed presets in the preset picker.

Think of it as answering:
- Which preset options should always be available when Design Builder starts?
- Should a preset affect token overrides, component overrides, or both?

Accepted input forms:

1. An array of preset definitions
2. An object map where each key becomes the fallback preset id

Accepted preset fields:

- `id`: required unique identifier (or inferred from the object-map key)
- `label`: display label
- `name`: fallback display label when `label` is omitted
- `state`: explicit shared override state
- `overrides`: alias for `state`
- `token`: shorthand for a token-only preset
- `component`: shorthand for a component-only preset

Normalized runtime shape:

```ts
type DesignBuilderProvidedPreset = {
  id: string;
  label: string;
  state: {
    token: Record<string, string>;
    component: Record<string, Record<string, Record<string, string>>>;
  };
  targets: {
    token: boolean;
    component: boolean;
  };
};
```

Example array form:

```json
[
  {
    "id": "dark",
    "label": "Dark",
    "token": {
      "--color--primary": "#111111"
    }
  },
  {
    "id": "button-compact",
    "label": "Compact Button",
    "component": {
      "__general__": {
        "button": {
          "--c-button--spacing--y": "0.5rem"
        }
      }
    }
  }
]
```

Example object-map form:

```json
{
  "dark": {
    "label": "Dark",
    "state": {
      "token": {
        "--color--primary": "#111111"
      }
    }
  }
}
```

Preset targets are inferred from the provided payload. A token-only preset updates only the token slice, and a component-only preset updates only the component slice. This lets hosts provide focused presets without wiping the other part of the shared override state.

### Important

Component-level mode is DOM payload driven.
No window fallback or fetch fallback is used for token library in current implementation.

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
- source/design-builder/design-builder.css (internal UI styles, bundled into the design-builder JavaScript and injected into the shadow root or document when needed)
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
- assets/dist/css/design-builder-external.css

## Adding or extending functionality

### Add new token control behavior

- Add or update control elements in source/design-builder/shared/control-elements/controls/
- Add or update layout components in source/design-builder/shared/control-elements/controls/layout/
- Keep source/design-builder/shared/control-elements/createDesignBuilderControls.ts as the thin composition/adapter entry
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
- the `<design-builder>` root has valid `component-data`
- the `<design-builder>` root has valid `token-data`
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
