<?php

namespace HbgStyleGuide;

class Asset
{
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
        return array_filter(self::readManifest(), fn($item) => str_starts_with($item, 'css/'));
    }

    private static function getScripts(): array
    {
        return array_filter(self::readManifest(), fn($item) => str_starts_with($item, 'js/'));
    }

    private static function readManifest(): array
    {
        $manifestPath = realpath( __DIR__ . '/../../assets/dist/manifest.json');

        if (!file_exists($manifestPath)) {
            return [];
        }
        $contents = file_get_contents($manifestPath);
        return json_decode($contents, true) ?? [];
    }

}
