<?php

declare(strict_types=1);

namespace MunicipioStyleGuide\Customize;

/**
 * Resolves customize-related assets and payload for global styleguide usage.
 */
class CustomizeAssets
{
    private const MANIFEST_PATH = 'assets/dist/manifest.json';
    private const CUSTOMIZE_DATA_PATH = 'component-design-tokens.json';
    private const TOKEN_LIBRARY_DATA_PATH = 'source/data/design-tokens.json';
    private const CUSTOMIZE_SCRIPT_KEY = 'js/design-builder.js';
    private const CUSTOMIZE_STYLE_KEY = 'css/design-builder-external.css';

    /**
     * Builds customize asset and payload data for view rendering.
     *
     * @return array{script: ?string, style: ?string, data: ?string, tokenLibrary: ?string}
     */
    public static function get(): array
    {
        $manifest = self::readManifest();

        return [
            'script' => self::resolveAssetPath($manifest, self::CUSTOMIZE_SCRIPT_KEY),
            'style' => self::resolveAssetPath($manifest, self::CUSTOMIZE_STYLE_KEY),
            'data' => self::readCustomizeData(),
            'tokenLibrary' => self::readTokenLibraryData(),
        ];
    }

    /**
     * @return array<string, string>
     */
    private static function readManifest(): array
    {
        $manifestPath = self::resolveBasePath() . self::MANIFEST_PATH;

        if (!is_file($manifestPath)) {
            return [];
        }

        $manifestContents = file_get_contents($manifestPath);
        if (!is_string($manifestContents)) {
            return [];
        }

        $manifest = json_decode($manifestContents, true);

        return is_array($manifest) ? $manifest : [];
    }

    /**
     * @param array<string, string> $manifest
     *
     * @return string|null
     */
    private static function resolveAssetPath(array $manifest, string $assetKey): ?string
    {
        if (!isset($manifest[$assetKey]) || !is_string($manifest[$assetKey]) || $manifest[$assetKey] === '') {
            return null;
        }

        return '/assets/dist/' . ltrim($manifest[$assetKey], '/');
    }

    /**
     * @return string|null
     */
    private static function readCustomizeData(): ?string
    {
        return self::readJsonPayload(self::CUSTOMIZE_DATA_PATH);
    }

    /**
     * @return string|null
     */
    private static function readTokenLibraryData(): ?string
    {
        return self::readJsonPayload(self::TOKEN_LIBRARY_DATA_PATH);
    }

    /**
     * @param string $relativePath
     *
     * @return string|null
     */
    private static function readJsonPayload(string $relativePath): ?string
    {
        $dataPath = self::resolveBasePath() . $relativePath;

        if (!is_file($dataPath) || !is_readable($dataPath)) {
            return null;
        }

        $data = file_get_contents($dataPath);
        if (!is_string($data) || $data === '') {
            return null;
        }

        $decodedData = json_decode($data, true);

        return is_array($decodedData) ? json_encode($decodedData, JSON_UNESCAPED_SLASHES) : null;
    }

    /**
     * @return string
     */
    private static function resolveBasePath(): string
    {
        if (defined('BASEPATH')) {
            return rtrim((string) BASEPATH, '/') . '/';
        }

        return rtrim((string) realpath(__DIR__ . '/../../../'), '/') . '/';
    }
}
