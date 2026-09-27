# Component assets

Component CSS and JS build entries live inside `source/components/<slug>/` beside the component's `style.scss` and initializer. `vite.config.mjs` discovers `entry.scss` and `entry.ts` there. Deleting a component directory removes its entries from the next build.

`entry.scss` wraps the component stylesheet in the `components` cascade layer. `entry.ts` starts the component's JavaScript. The base `styleguide-css` and `styleguide-js` entries contain shared page code and documentation behavior.

The component library calls `AssetEnqueuerInterface::enqueueComponent()` as each Blade directive renders. The styleguide's `Asset::createEnqueuer()` resolves built URLs from the Vite manifest. After the complete page renders, `View` inserts collected CSS in the head and module scripts at the bottom. This covers components rendered inside the layout and nested components. The `PhpAssetEnqueuer` also follows `sass.components` dependencies from library `config.php` and removes duplicate handles.

To request an asset outside a component directive, call `$assetEnqueuer->enqueueComponent('slug')`, `$assetEnqueuer->enqueueStyle($handle, $url)`, or `$assetEnqueuer->enqueueScript($handle, $url)` before the page is emitted. `index.php` creates the enqueuer and passes it to `ComponentLibrary\Init` and `App`.
