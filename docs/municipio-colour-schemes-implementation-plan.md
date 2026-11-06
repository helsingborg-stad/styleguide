# Municipio colour schemes implementation plan

## Goal

Consume Design Builder's backwards-compatible colour-scheme payload so Municipio sites respect a visitor's dark-mode and increased-contrast preferences without changing the base-theme contract.

## Payload contract

Municipio should continue to persist and consume the existing `token` and `component` maps. Add support for these optional siblings:

```json
{
  "token": { "--color--primary": "#0055aa" },
  "_dark": { "--color--primary": "#9cc2ff" },
  "_contrast": null,
  "component": {}
}
```

- Missing `_dark` / `_contrast` means no variant, for full compatibility with existing saved site settings.
- `null` explicitly means the variant is disabled.
- A non-null variant must be limited to the Design Builder allow-list: direct colour roles, `--color--border-mix-amount`, `--shadow-color`, `--shadow-amount`, and component variables whose component-setting definition explicitly sets `themeable: true`.
- Themeable component settings are serialized as their component `-default` custom property (for example, `--c-link--color-mix-amount-default`). Component styles resolve the explicit instance property first and the variant default second, so themes update uncustomized instances without overriding intentional component-level choices.
- Do not store derived `-border`, `-alt`, or `-contrast-muted` values. They continue to derive from their parent roles.

## Delivery steps

1. **Schema and persistence**
   - Extend the Municipio theme-settings schema/API to accept `_dark` and `_contrast` as nullable string maps.
   - Preserve unknown legacy payloads exactly; do not migrate or rewrite a saved theme until it is explicitly saved.
   - Validate incoming maps against the token library and reject disallowed keys.

2. **Server-side style generation**
   - Keep the current base CSS custom-property output unchanged.
   - Generate a separate inline stylesheet, after base variables:

     ```css
     @media (prefers-color-scheme: dark) {
       :root { /* _dark variables */ }
     }
     @media (prefers-contrast: more), (forced-colors: active) {
       :root { /* _contrast variables */ }
     }
     ```

   - Do not emit an empty media query for null or missing variants.
   - Ensure the contrast query is output after dark so high contrast wins when both preferences match.

3. **Design Center integration**
   - Pass the complete override document to the Design Builder root rather than only its `token` slice.
   - Persist the `design-builder:save` event's complete `state` object.
   - Keep Municipio's existing base-token editor entry point; the selector is rendered by Design Builder.

4. **Preview and accessibility checks**
   - In the Design Center, Base/Dark/High contrast selection must preview its chosen scheme independently of the browser preference.
   - Verify keyboard focus, form error states, notices, headers, navigation, overlays, and print styles in each mode.
   - Confirm contrast against the actual rendered foreground/background pairs, including muted text and borders.

5. **Migration release**
   - Release schema support first, with no generated variant CSS for existing sites.
   - Release the Design Center update next so editors can opt in deliberately.
   - Add telemetry/logging only for validation failures, never for user preference values.

## Acceptance criteria

- Existing Municipio themes render byte-for-byte equivalent base CSS when no variants are configured.
- A dark or high-contrast variant affects only its media-query context.
- A null variant produces no media-query output.
- The stored document round-trips through Design Builder without losing `token`, `component`, `_dark`, or `_contrast`.
- A malformed or extra variant key is rejected server-side and cannot be added through the UI.

## Test matrix

| Case | Expected result |
| --- | --- |
| Existing theme without variant keys | Current output unchanged |
| `_dark: null` | No dark media query |
| Complete `_dark` map | Variables emitted only in dark query |
| Complete `_contrast` map | Variables emitted only in contrast/forced-colors query |
| Both variants present | Contrast output follows dark output |
| Extra or derived token in a variant | Validation failure / omitted from output |
| Active palette colour added or removed | Each enabled variant receives/removes the matching pair |
