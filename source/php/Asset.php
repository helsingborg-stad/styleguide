<?php

namespace MunicipioStyleGuide;

use ComponentLibrary\Assets\PhpAssetEnqueuer;

class Asset
{
    private static ?array $utilityMapCache = null;

    public static function createEnqueuer(): PhpAssetEnqueuer
    {
        $manifest = self::readManifest();
        $enqueuer = new PhpAssetEnqueuer();
        if (isset($manifest['css/styleguide-css.css'])) {
            $enqueuer->enqueueStyle('styleguide-base', '/assets/dist/' . $manifest['css/styleguide-css.css']);
        }
        if (isset($manifest['js/styleguide-js.js'])) {
            $enqueuer->enqueueScript('styleguide-base', '/assets/dist/' . $manifest['js/styleguide-js.js']);
        }
        foreach ($manifest as $key => $file) {
            if (!is_string($file)) {
                continue;
            }
            if (preg_match('~^css/components/([^/]+)\\.css$~', $key, $matches)) {
                $enqueuer->registerComponent($matches[1], '/assets/dist/' . $file);
            }
            if (preg_match('~^js/components/([^/]+)\\.js$~', $key, $matches)) {
                $enqueuer->registerComponent($matches[1], null, '/assets/dist/' . $file);
            }
        }
        foreach (self::readUtilityMap()['order'] ?? [] as $order => $name) {
            $key = 'css/utilities/' . $name . '.css';
            if (isset($manifest[$key])) {
                $enqueuer->registerUtility($name, '/assets/dist/' . $manifest[$key], $order);
            }
        }
        // Shared documentation scripts can add display classes after the initial render.
        $enqueuer->enqueueUtility('display');
        return $enqueuer;
    }

    public static function enqueueUtilitiesFromHtml(
        string $html,
        PhpAssetEnqueuer $enqueuer,
        ?array $utilityMap = null,
    ): void {
        $classes = ($utilityMap ?? self::readUtilityMap())['classes'] ?? [];
        if (!preg_match_all('/\sclass\s*=\s*(["\'])(.*?)\1/s', $html, $attributes)) {
            return;
        }
        foreach ($attributes[2] as $attribute) {
            foreach (preg_split('/\s+/', html_entity_decode($attribute, ENT_QUOTES | ENT_HTML5, 'UTF-8')) as $className) {
                foreach ($classes[$className] ?? [] as $name) {
                    $enqueuer->enqueueUtility($name);
                }
            }
        }
    }

    private static function readUtilityMap(): array
    {
        if (self::$utilityMapCache !== null) {
            return self::$utilityMapCache;
        }
        $path = __DIR__ . '/../../assets/dist/utility-class-map.json';
        if (!is_file($path)) {
            return [];
        }
        $map = json_decode((string) file_get_contents($path), true);
        return self::$utilityMapCache = is_array($map) ? $map : [];
    }

    public static function getAll(): array 
    {
        return [
            'styles' => self::getStyles(),
            'scripts' => self::getScripts(),
            'manifest' => self::readManifest(),
        ];
    }

    private static function getStyles(): array
    {
        return array_filter(
            self::readManifest(),
            fn($item, $key) => $key === 'css/styleguide-css.css',
            ARRAY_FILTER_USE_BOTH
        );
    }

    private static function getScripts(): array
    {
        return array_filter(
            self::readManifest(),
            fn($item, $key) => $key === 'js/styleguide-js.js',
            ARRAY_FILTER_USE_BOTH
        );
    }

    private static function readManifest(): array
    {
        $manifestPath = __DIR__ . '/../../assets/dist/manifest.json';

        if (!file_exists($manifestPath)) {
            return [];
        }
        $contents = file_get_contents($manifestPath);
        $decoded = json_decode($contents, true);
        return is_array($decoded) ? $decoded : [];
    }

}
