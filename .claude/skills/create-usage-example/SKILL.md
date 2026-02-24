---
name: create-usage-example
description: Automatically identify and add missing usage examples for a component in the styleguide. Usage: /create-usage-example {ComponentName}
argument-hint: <ComponentName>
allowed-tools: Read, Glob, Grep, Write, Edit, Bash
---

Analyse a component's documentation coverage and add every missing usage example that has meaningful documentation value.

## Arguments

Parse `$ARGUMENTS` as: `{ComponentName}`

- `ComponentName` — Identifies the component. Accept any of these formats and normalise to the PascalCase PHP directory name:
  - PascalCase PHP name: `Nav`, `Hero`, `Button`
  - SCSS file path: `source/sass/component/_nav.scss` or `@source/sass/component/_nav` → `Nav`
  - URL path: `http://localhost:.../components/molecules/nav` → `Nav`
  - Lowercase slug: `nav`, `hero` → `Nav`

## Step 1 — Discover the component source

Locate the component directory:
```
vendor/helsingborg-stad/component-library/source/php/Component/{ComponentName}/
```

Read these files (all may not exist — skip gracefully):

1. **`{ComponentName}.json`** (or the json file in that directory) — defines all accepted parameters, their types, defaults, and descriptions. The `"slug"` field gives the URL/directory slug used in usage examples.
2. **`{ComponentName}.php`** — the PHP controller. Read it carefully to understand:
   - How input parameters are transformed before reaching the view (`$this->data[...]` assignments)
   - Conditional logic that changes class lists or data based on parameter values
   - Any special parameter aliases (e.g. `buttonArgs` becoming `$buttons` for multi-button cases)
   - Item-level fields normalised in `normalizeItems()` (e.g. `active`, `ancestor`, `style`, `icon`, `classList`)
   - Which view is rendered and how `heroView`-style selectors work
3. **`views/`** — list all view blade files and read each one to understand what variants exist.
4. **`partials/`** — skim available partials; read any that are referenced by views.

## Step 1b — Check the local SCSS for modifier classes

After reading the component source, also check the styleguide's own SCSS for the component:
```
source/sass/component/_{slug}.scss
```

This file often defines **modifier classes** (e.g. `--align-left`, `--bordered`, `--gap`) that are not listed in the component JSON but can be applied via the base controller's `classList` parameter. Scan all `&--` selectors and note any modifiers that represent distinct visual variants.

The full modifier class name is constructed as `{baseClass}--{modifier}` (e.g. `c-nav--bordered`) and is passed via `'classList' => ['c-nav--bordered']`.

Also look for **context-dependent rules** such as `a > .c-{slug}` or `.some-parent .c-{slug}`. These indicate the component has a distinct visual state when placed inside a specific HTML element. Demonstrate these by wrapping the `@{slug}([...]) @end{slug}` call in the relevant HTML in the blade file — the component itself may have no corresponding parameter.

## Step 2 — Study existing usage examples

The usage examples live at:
```
views/pages/components/usage/{slug}/
```

where `{slug}` comes from the `"slug"` field in the component JSON (usually the lowercase component name).

Read:
- The usage **`{slug}.json`** — to see how existing examples are registered (heading, subHeading, text fields). Note entries where `text` is empty — backfill them when editing the file (Step 5).
- **All existing `.blade.php` files** in that directory — to understand the argument style, formatting conventions, and what is already covered.

## Step 3 — Gap analysis: identify ALL missing examples

Build a complete inventory of what *could* be demonstrated, then subtract what *already is* demonstrated.

Sources of candidates:
- **Parameter variants**: boolean flags (`compressed`, `indentSubLevels`), enum-like string parameters (`height: sm/md/lg`), optional object/array parameters not shown.
- **Item-level states**: `active`, `ancestor`, icon items, items with `classList`, multi-level nesting.
- **View variants**: each distinct view file (e.g. `callToActions.blade.php`, `split.blade.php`) should have at least one example.
- **SCSS modifier classes**: every `&--{modifier}` selector that produces a meaningfully different visual result.
- **Context-dependent rules**: component placed inside a specific wrapper element.

For each candidate, judge its documentation value:
- **High value**: demonstrates a feature that changes visible output and is not covered at all.
- **Low value**: trivial variation already implied by an existing example.

Compile a prioritised list of all high-value gaps. You will create examples for **all of them**, starting with the highest-value gap first.

Good gap candidates:
- Item-level state: `active`, `ancestor` (current-page highlighting)
- Height or size variants (`height: sm/md/lg`) if not shown in isolation
- Modifier classes from SCSS (`c-nav--gap`, `c-nav--drawer`, etc.)
- `indentSubLevels`, `compressed`, icon-only items, or other boolean flags
- Each alternate view (callToActions, split, etc.)

## Step 4 — Understand what makes a good example

Before writing each example, reason through:

- **What is the purpose of this example?** It should demonstrate one specific ability or variant of the component.
- **Which parameters are required vs optional?** Use the component JSON defaults and the PHP controller to determine the minimum needed.
- **Are there data-flow surprises?** (e.g. in Hero: passing `buttonArgs` as an array-of-arrays routes to `$buttons` in the view rather than a single `$buttonArgs`). Always trace the PHP controller logic.
- **Does this view use slots?** Some components use `@component`/`@slot` or content slots. Check the blade view for `{!! $slot !!}`, `$content`, or `@slot` directives.
- **Does this view require `customHeroData` or equivalent?** Some views have a secondary data bag passed via a dedicated parameter.
- **For nav-like components:** item arrays support fields like `active`, `ancestor`, `style`, `icon`, `classList` — these are item-level, not top-level parameters. Use them to demonstrate states like the current-page trail.
- Use realistic but short placeholder content (lorem ipsum sentences, `https://picsum.photos` for images).
- When an example needs a dropdown to be visible on screen, wrap the component in a container with enough padding/height below it (see `horizontal-dropdown.blade.php`).

## Step 5 — Create all missing blade files

For each gap identified in Step 3, write the file to:
```
views/pages/components/usage/{slug}/{exampleName}.blade.php
```

Follow the exact formatting of existing examples:
- Use the `@{slug}([...]) @end{slug}` Blade component syntax.
- Parameters as a PHP array — one per line, indented 4 spaces.
- If the component uses slots, place them inside the component tags.
- Keep it minimal — only include parameters that are necessary to demonstrate the feature. Do not add noise.

Create all files before moving on to registration.

## Step 6 — Register all new examples in the usage JSON

Edit `views/pages/components/usage/{slug}/{slug}.json` to add an entry for each new example:

```json
"{exampleName}": {
    "heading": "...",
    "subHeading": "",
    "text": "..."
}
```

- `heading`: A short, human-readable label for the example (e.g. `"Hero with call to actions"`).
- `text`: One sentence describing what the example renders and what it demonstrates. **Never leave `text` empty.** Also backfill any other entries that have an empty `text` field while editing the file.
- Match the tone and style of existing entries exactly.

Add all new entries in a single edit pass.

## Conventions to follow

- Never add parameters that aren't needed to demonstrate the specific example.
- Image URLs: use `https://picsum.photos/id/{id}/{width}/{height}` with realistic dimensions.
- Placeholder text: use short Latin lorem ipsum — match the length used in nearby examples.
- Do not invent parameter names — every parameter used must exist in the component JSON or be traceable through the PHP controller or `normalizeItems()`.
- If the example involves a specific `heroView`-style variant selector, always include that parameter.
- When done, summarise to the user: list every file created and each JSON entry added.
