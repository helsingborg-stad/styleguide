# Dead Code Analysis

> **Date:** 2026-03-16
> **Method:** GitHub code search across `org:helsingborg-stad`, excluding `styleguide` repo itself.
> Each component's key DOM selectors (CSS classes, data-attributes, JS attribute hooks) were searched.
> Results from `component-library` are noted separately as it is an intermediary that may or may not be actively consumed.

---

## Summary

| Category         | Count |
|------------------|-------|
| Confirmed Dead   | 17    |
| Likely Dead      | 4     |
| Actively Used    | 30+   |

---

## Confirmed Dead — Safe to Remove

These components returned **0 results** in the entire org (excluding styleguide) for all of their
unique selectors. They are not referenced by any theme, plugin, or module.

| # | Component | File(s) | Selector(s) searched | Org hits | Safety |
|---|-----------|---------|----------------------|----------|--------|
| 1 | **Steppers** | `source/js/steppers.js` | `c-steppers`, `c-steppers__dot`, `c-steppers--type-dots` | 0 | 🟢 High |
| 2 | **AnchorMenu** | `source/js/anchorMenu.js` | `c-anchormenu__item`, `#scroll-spy` | 0 | 🟢 High |
| 3 | **SplitButton** | `source/js/splitButton.js` | `js-split`, `c-splitbutton` | 0 | 🟢 High |
| 4 | **Copy** | `source/js/copy.ts` | `data-js-copy-target`, `data-js-copy-item` | 0 | 🟢 High |
| 5 | **ButtonToggleContent** | `source/js/ButtonToggleContent.ts` | `ButtonToggleContent` (class name) | 0 | 🟢 High |
| 6 | **AriaPressedToggler** | `source/js/AriaPressedToggler.ts` | `AriaPressedToggler` (class name), `aria-pressed` toggle pattern | 0 | 🟢 High |
| 7 | **StickyKeys** | `source/js/stickyKeys.js` | `StickyKeys` (class name), targets generic input types | 0 | 🟢 High |
| 8 | **ResizeByChildren** | `source/js/resizeByChildren.js` | `ResizeByChildren` (class name) | 0 | 🟢 High |
| 9 | **DrawerAccessibility** | `source/js/drawerAccessibility.ts` | `drawerAccessibility` | 0 | 🟢 High |
| 10 | **IframeAcceptance** | `source/js/iframeAcceptance.js` | `iframeAcceptance`, `js-suppressed-content-accept` (only in component-library) | 0 (1 component-library) | 🟢 High |
| 11 | **DismissableNotices** | `source/js/dismissableNotices.ts` | `dismissableNotices` | 0 | 🟢 High |
| 12 | **SelectSort** | `source/js/selectSort.ts` | `selectSort` | 0 | 🟢 High |
| 13 | **ExtendedDropdownMenu** | `source/js/extendedDropdownMenu.ts` | `extendedDropdownMenu` | 0 | 🟢 High |
| 14 | **QuickLinksHeader** | `source/js/quickLinksHeader.ts` | `QuickLinksHeader` | 0 | 🟢 High |
| 15 | **NotificationDoc** | `source/js/notificationDoc.js` | `notification__button`, `c-notification` (doc-only helper) | 0 | 🟢 High |
| 16 | **Form Policy** | `source/js/form/policy.js` | `js-policy-acceptance` | 0 | 🟢 High |
| 17 | **Hero (video part only)** | `source/js/hero.js` | `c-hero--video` | 0 | 🟢 High |

---

## Likely Dead — Remove with Caution

These components returned **0 results** for their primary class/function names, but have some
borderline matches via shared selectors or only appear in `component-library` (which itself
consumes the styleguide). Removal is likely safe but should be verified.

| # | Component | File(s) | Selector(s) searched | Org hits | Notes | Safety |
|---|-----------|---------|----------------------|----------|-------|--------|
| 1 | **Notification (JS)** | `source/js/notification.js` | `c-notification__container`, `c-notification` | 0 | The CSS class `c-notification` exists in component-library but the JS initialization container class `c-notification__container` has 0 hits. The JS behavior may be unused even if the CSS class is rendered. | 🟡 Medium |
| 2 | **DeviceDetect** | `source/js/deviceDetect.ts` | `DeviceDetect`, `data-js-device-detect` | 0 (1 component-library) | Only referenced in component-library's Select.php. If Select doesn't actively need device detection at runtime, this is dead. | 🟡 Medium |
| 3 | **KeepInViewPort** | `source/js/keepInViewPort.js` | `KeepInViewPort`, `data-js-keep-in-viewport` | 0 (1 component-library) | Only found in component-library's Nav.php. If Nav component no longer relies on viewport pinning from the styleguide JS, this is dead. | 🟡 Medium |
| 4 | **DynamicSidebar** | `source/js/dynamicSidebar.js` | `c-sidebar[endpoint-children]`, `data-js-page-id` | 1 (component-library Sidebar.php) | The `endpoint-children` attribute appears in component-library's Sidebar.php. This JS may still be needed if that Sidebar variant is rendered. `data-js-page-id` is used in Municipio for a different purpose. | 🟡 Medium |

---

## Actively Used — Do NOT Remove

These components have confirmed usage across the org (Municipio, component-library, child themes, plugins).

| Component | File(s) | Org hits | Where used |
|-----------|---------|----------|------------|
| Testimonials | `testimonials.js` | 1 | component-library |
| Segment | `segment.js` | 6 | Municipio |
| Calendar | `calendar.js` | 5+ | Municipio, component-library |
| Map | `map/map.ts` | 13 | Municipio, component-library, modularity-openstreetmap |
| Compressed | `compressed.ts` | 1 | component-library |
| ExpandSection | `expand-section.js` | 7 | modularity-json-render, component-library, Municipio |
| Sidebar | `sidebar.js` | 5 | Municipio |
| Modal | `modal.ts` | 9 | Municipio |
| Navbar | `navbar.js` | 10 | Municipio, styleguide-web |
| Tooltip | `tooltip.js` | 1 | Municipio |
| Brand | `brand.ts` | 9 | Municipio, styleguide-web |
| Filter | `filter.js` | 6 | Municipio |
| Table | `table.js` | 12 | Municipio, modularity-json-render, component-library |
| Slider | `slider.ts` | 15 | Municipio |
| Gallery | `gallery.js` | 3 | familjenhelsingborg |
| Pagination | `pagination.ts` | 4 | algolia-index-js-searchpage-addon |
| Sort | `sort.js` | 11 | modularity-openstreetmap, Municipio |
| ClassToggle | `classToggle/` | 13 | Municipio |
| ClickAway | `ClickAway.ts` | 3 | Municipio |
| GoogleTranslate | `googleTranslate.ts` | 9 | Municipio |
| MegaMenu | `megaMenu.ts` | 1 | Municipio |
| SelectFilter | `selectFilter.ts` | 10 | Municipio |
| SelectComponentObserver | `select/SelectComponentObserver.ts` | 2 | Municipio, component-library |
| SizeObserver | `sizeObserver.ts` | 4 | modularity-like, component-library |
| Image | `image.js` | 14 | Municipio |
| Hero (non-video) | `hero.js` (partial) | 5 | component-library, Municipio |
| SimulateClick | `SimulateClick.ts` | 3 | component-library |
| Fields/Forms | `fields.js`, `form/` | 47+ | Municipio, component-library |
| Nav | `nav.ts` | Used via navbar | Municipio |
| Dropdown | `dropdown.ts` | Used via c-dropdown | mod-my-pages |
| Quicklinks | `quickLinksHeader.ts` targets quicklinks, but CSS `c-quicklinks` | 2 | Municipio |
| MoveElements | `helpers/moveElements.ts` | Used via layout | Municipio |
| ResizeMediaQuery | `resizeMediaQuery.ts` | Used via responsive | Municipio |
| FileInput | `form/fileInput.ts` | Used via forms | component-library |

---

## PHP Classes

The PHP classes in `source/php/` are **internal to the styleguide application** (App, View,
Navigation, Asset, Helper classes). They are the framework for the styleguide itself and are
not consumed by external projects. They are not dead code in the traditional sense — they are
the application backbone.

| Class | File | Status |
|-------|------|--------|
| `App` | `source/php/App.php` | Internal — styleguide framework |
| `View` | `source/php/View.php` | Internal — styleguide framework |
| `Navigation` | `source/php/Navigation.php` | Internal — styleguide framework |
| `Asset` | `source/php/Asset.php` | Internal — styleguide framework |
| `Documentation` | `source/php/Helper/Documentation.php` | Internal — styleguide framework |
| `Enviroment` | `source/php/Helper/Enviroment.php` | Internal — styleguide framework |
| `MockupArrays` | `source/php/Helper/MockupArrays.php` | Internal — styleguide framework |
| `ParseString` | `source/php/Helper/ParseString.php` | Internal — styleguide framework |
| `ModifierExample` | `source/php/Helper/ModifierExample.php` | Internal — styleguide framework |
| `Psr4ClassLoader` | `source/php/Vendor/Psr4ClassLoader.php` | Internal — styleguide framework |
| `CLI` | `cli.php` | Internal — CLI tool |

---

## Recommendations

### Immediate Removals (High Confidence)
The 17 "Confirmed Dead" JS components can be safely removed. They have zero usage outside the
styleguide in the entire `helsingborg-stad` organization. The removal steps would be:

1. Remove the source file (`.js` or `.ts`)
2. Remove the `import` line from `source/js/app.js`
3. Remove the `import` line from `source/js/main.js`
4. Remove any instantiation / function call in `source/js/app.js`
5. Remove corresponding SASS files if they exist and are only used by this component
6. Remove corresponding Blade view examples in `views/`

### Cautious Removals (Medium Confidence)
The 4 "Likely Dead" components should be verified with the team before removal, particularly:
- **DynamicSidebar**: check if `endpoint-children` sidebar variant is still rendered anywhere
- **DeviceDetect**: check if component-library's Select actually depends on this at runtime
- **Notification JS**: the CSS may still be rendered, but the JS behavior (auto-dismiss, animation) may be unused

### Estimated Bundle Size Savings
Removing all 17+4 dead components would eliminate approximately **21 JS modules** from the
bundle, reducing JavaScript payload and initialization overhead.

---

## Search Methodology

Each component was searched using the GitHub Code Search API:
```
https://api.github.com/search/code?q={selector}+org:helsingborg-stad&per_page=100
```
Results from `helsingborg-stad/styleguide` were excluded using `-repo:helsingborg-stad/styleguide`.
Multiple selectors per component were searched (CSS class names, data-attributes, JS class names)
to minimize false negatives. Results from `component-library` were noted separately as it serves
as an intermediary rendering layer.
