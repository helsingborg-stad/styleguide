# Component assets

Component CSS and JS build entries live inside `source/components/<slug>/` beside the component's `style.scss` and initializer. `vite.config.mjs` discovers `entry.scss` and `entry.ts` there. Deleting a component directory removes its entries from the next build.

`entry.scss` wraps the component stylesheet in the `components` cascade layer, except for Inherit Boundary, whose resets live in `inherit-boundaries`. `entry.ts` starts the component's JavaScript. The base `styleguide-css` and `styleguide-js` entries contain shared page code and documentation behavior.

The component library calls `AssetEnqueuerInterface::enqueueComponent()` as each Blade directive renders. The styleguide's `Asset::createEnqueuer()` resolves built URLs from the Vite manifest. After the complete page renders, `View` inserts collected CSS in the head and module scripts at the bottom. This covers components rendered inside the layout and nested components. The `PhpAssetEnqueuer` also follows `sass.components` dependencies from library `config.php` and removes duplicate handles.

To request an asset outside a component directive, call `$assetEnqueuer->enqueueComponent('slug')`, `$assetEnqueuer->enqueueStyle($handle, $url)`, or `$assetEnqueuer->enqueueScript($handle, $url)` before the page is emitted. `index.php` creates the enqueuer and passes it to `ComponentLibrary\Init` and `App`.

## Utility CSS

Each utility in `source/utilities/<name>/` has its own `entry.scss`. The entry wraps its CSS in `@layer utilities`; the base stylesheet declares the full layer order before these files load. `source/utilities/order.json` preserves the old order within that layer when several utility files match a page.

The build writes `assets/dist/utility-class-map.json` from the compiled selectors. After rendering, `View` scans actual `class` attributes and enqueues only utility files defining those classes. Repeated classes and URLs produce one link. The shared documentation scripts can add display classes after rendering, so `display` is a base utility. Component `config.php` can declare a `utilities` dependency for classes added later by its JavaScript; modal, field, and acceptance use this for overflow, color, and z-index. `enqueueUtility($name)` is also available for manual cases.

## Inheritance boundaries

The cascade order is defined in `source/sass/_layers.scss`. The base stylesheet and standalone boundary entry both load this shared prelude. `inherit-boundaries` is the final layer, after `theme`; reserve it for the boundary reset contract.

`@inheritboundary` adds `data-inherit-boundary` to each top-level element in its content. On those elements, every public `--inherit-*` hook is reset to `initial`. These resets beat normal declarations in all earlier layers regardless of selector specificity or stylesheet order. Keep the selector at zero specificity with `:where()` and keep the reset list in sync with public hooks. Do not add `!important`: important declarations reverse layer priority.

A boundary resets the root only. Components inside it may publish new context for their descendants, as the Drawer does for its navigation. If the root itself must publish context, place that publishing element inside the boundary; a normal layered declaration on the root will lose to the reset.

Container selectors that assign inheritance hooks directly to descendants must exclude both boundary roots and their descendants. The Header's exclusions are part of this contract: a layer cannot prevent a declaration on a descendant from beating an inherited value. New container rules must respect the same boundary.

Use layers for styleguide, plugin, utility and theme rules. Unlayered rules, inline styles and `!important` declarations can override normal layered resets and are explicit escape hatches, not part of the boundary guarantee. Boundaries clear public hooks; they do not reset native CSS inheritance (such as `color`) or component token overrides.
