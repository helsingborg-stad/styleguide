# Playwright Component Customizer Test Rules

This document defines the required rules for Playwright tests that validate component customizer panels.

Primary reference implementation:
- [source/components/drawer/tests/drawer.spec.ts](source/components/drawer/tests/drawer.spec.ts)

## Purpose

These tests must ensure that component customizer controls:
1. Exist and are discoverable in the UI.
2. Actually change rendered appearance/behavior (not only CSS variable strings).
3. Are fully covered so panel changes break tests until coverage is updated.

## Mandatory Rules

### 1. Test the full panel (no partial coverage)

Each customizer panel test suite must include:
- Panel open/boot test.
- Control inventory test (strict).
- One behavior test per control.
- Reset behavior test (when reset exists).

### 2. Add a strict control inventory test

Each suite must assert:
- Exact number of visible controls.
- Exact set of control labels.

This test must fail when controls are added, removed, or renamed and tests are not updated.

### 3. Assert visual/computed outcomes, not only variable assignment

Do not only assert that a CSS custom property exists.

Prefer assertions like:
- Width/height/padding/margin changed (`getComputedStyle`).
- Background/filter/opacity changed (`getComputedStyle`).
- Visible UI state changed (class/state/visibility).

### 4. Handle control input types generically

Control rows may render different input types:
- Swatch options
- `<input type="color">`
- `<input type="range">`
- `<select>`

Use a helper that can change values across supported control types.

### 5. Handle confirmation dialogs explicitly

If reset/delete actions use `confirm(...)`, tests must accept the dialog:
- `page.once('dialog', (dialog) => dialog.accept());`

### 6. Keep tests deterministic

If interactive toggles are flaky for open-state visuals, force deterministic test state in page context when appropriate.

Example: for drawer overlay/elevation checks, explicitly set the drawer open class/state before reading computed styles.

## Required Suite Shape (Template)

For each component customizer suite:

1. `beforeEach`
- Navigate to component page.
- Open customizer panel.
- Wait for panel root.
- Select target component in `#db-component-select` by value.

2. `panel opens` test
- Validate panel visibility.

3. `control inventory` test
- Expand categories.
- Read all visible labels.
- Assert exact count + exact label list.

4. `behavior tests`
- One per control label/category setting.
- Assert rendered/computed change.

5. `reset test`
- Change one or more controls.
- Confirm changed visual/computed state.
- Reset + accept dialog.
- Assert baseline restored.

## Drawer-Specific Control Map (Current)

Current drawer panel controls covered in tests:
- Main Panel Color (variant 1)
- Main Panel Color (variant 2)
- Secondary Navigation Color
- Overlay Color
- Padding Multiplier
- Width Multiplier
- Shadow Color
- Shadow Intensity

Note: Duplicate labels can be valid when visibility conditions differ by target element/class context.

## Reuse Guidance for New Components

When creating a new component customizer Playwright test:

1. Start from the drawer suite structure in [source/components/drawer/tests/drawer.spec.ts](source/components/drawer/tests/drawer.spec.ts).
2. Build a control list from that component's `component.json` `componentSettings`.
3. Add behavior assertions tied to real rendered output for each control.
4. Keep the inventory guard updated with exact expected labels/count.
5. Run the component spec directly, then the full `npm run test:e2e`.

## Anti-Patterns (Do Not Use)

- Only checking that a CSS variable string exists on an element.
- Testing only some controls in a panel.
- Omitting a guard test for control additions/removals.
- Relying on implicit dialog handling for reset flows.

## Running Tests

Run one component suite:

```bash
npx playwright test source/components/<component>/tests/<component>.spec.ts
```

Run all e2e suites:

```bash
npm run test:e2e
```
