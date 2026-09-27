<?php

namespace MunicipioStyleGuide;

use ComponentLibrary\Assets\PhpAssetEnqueuer;

class Asset
{
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
        return $enqueuer;
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
