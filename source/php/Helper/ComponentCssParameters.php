<?php

namespace MunicipioStyleGuide\Helper;

/**
 * Resolves CSS parameter declarations for component documentation.
 */
class ComponentCssParameters
{
    /**
     * Build CSS parameter declarations for a component.
     *
     * @param string $slug Component slug.
     * @param string|null $basePath Optional project base path.
     *
     * @return array<int, array<string, string>>
     */
    public static function getForComponent(string $slug, ?string $basePath = null): array
    {
        $normalizedBasePath = rtrim($basePath ?? BASEPATH, '/');
        $componentConfigPath = $normalizedBasePath . '/source/components/' . $slug . '/component.json';
        $designTokensPath = $normalizedBasePath . '/source/data/design-tokens.json';

        if (!is_file($componentConfigPath) || !is_file($designTokensPath)) {
            return [];
        }

        $componentConfig = self::decodeJsonFile($componentConfigPath);
        $designTokensConfig = self::decodeJsonFile($designTokensPath);

        if (!is_array($componentConfig) || !is_array($designTokensConfig)) {
            return [];
        }

        $componentTokens = self::extractComponentTokens($componentConfig);
        if ($componentTokens === []) {
            return [];
        }

        return self::resolveParametersFromTokens($slug, $componentTokens, $designTokensConfig);
    }

    /**
     * Decode JSON file to an associative array.
     *
     * @param string $filePath File path.
     *
     * @return array<string, mixed>|null
     */
    private static function decodeJsonFile(string $filePath): ?array
    {
        $jsonContent = file_get_contents($filePath);
        if (!is_string($jsonContent)) {
            return null;
        }

        $decoded = json_decode($jsonContent, true);
        return is_array($decoded) ? $decoded : null;
    }

    /**
     * Extract declared component token references from component config.
     *
     * @param array<string, mixed> $componentConfig Component config data.
     *
     * @return array<int, string>
     */
    private static function extractComponentTokens(array $componentConfig): array
    {
        if (!isset($componentConfig['tokens']) || !is_array($componentConfig['tokens'])) {
            return [];
        }

        return array_values(
            array_filter(
                $componentConfig['tokens'],
                static fn (mixed $token): bool => is_string($token) && $token !== ''
            )
        );
    }

    /**
     * Resolve design-token settings into display-ready CSS parameter declarations.
     *
    * @param string $slug Component slug.
    * @param array<int, string> $componentTokens Tokens declared in component.json.
     * @param array<string, mixed> $designTokensConfig Parsed design token config.
     *
     * @return array<int, array<string, string>>
     */
    private static function resolveParametersFromTokens(string $slug, array $componentTokens, array $designTokensConfig): array
    {
        $categories = $designTokensConfig['categories'] ?? [];
        if (!is_array($categories)) {
            return [];
        }

        $settingsByToken = [];

        foreach ($categories as $category) {
            if (!is_array($category)) {
                continue;
            }

            $categorySettings = isset($category['settings']) && is_array($category['settings']) ? $category['settings'] : [];

            foreach ($categorySettings as $setting) {
                if (!is_array($setting)) {
                    continue;
                }

                $variable = $setting['variable'] ?? null;
                if (!is_string($variable) || !str_starts_with($variable, '--')) {
                    continue;
                }

                $tokenName = ltrim($variable, '-');
                $settingsByToken[$tokenName] = $setting;
            }
        }

        return self::buildLocalizedRows($slug, $componentTokens, $settingsByToken);
    }

    /**
     * Build localized CSS variable rows using component token declarations.
     *
     * @param string $slug
     * @param array<int, string> $componentTokens
     * @param array<string, array<string, mixed>> $settingsByToken
     *
     * @return array<int, array<string, string>>
     */
    private static function buildLocalizedRows(string $slug, array $componentTokens, array $settingsByToken): array
    {
        $componentPrefix = 'c-' . $slug;

        $rows = [];
        $seenVariables = [];

        foreach ($componentTokens as $token) {
            self::appendRow(
                $rows,
                $seenVariables,
                self::toLocalizedVariable($componentPrefix, $token),
                'var(--' . $token . ')',
                $settingsByToken[$token] ?? null
            );
        }

        return $rows;
    }

    /**
     * Append a CSS parameter row once.
     *
     * @param array<int, array<string, string>> $rows
     * @param array<string, bool> $seenVariables
     * @param string $localizedVariable
     * @param string $defaultValue
     * @param array<string, mixed>|null $setting
     *
     * @return void
     */
    private static function appendRow(array &$rows, array &$seenVariables, string $localizedVariable, string $defaultValue, ?array $setting): void
    {
        if (isset($seenVariables[$localizedVariable])) {
            return;
        }

        $rows[] = [
            'key' => $localizedVariable,
            'defaultValue' => $defaultValue,
            'type' => is_array($setting) && isset($setting['type']) && is_string($setting['type']) ? $setting['type'] : '-',
            'availableValues' => self::formatAvailableValues(is_array($setting) ? ($setting['options'] ?? null) : null),
            'description' => self::formatDescription($setting ?? []),
        ];

        $seenVariables[$localizedVariable] = true;
    }

    /**
     * Convert component prefix and token to localized CSS variable name.
     *
     * @param string $componentPrefix
     * @param string $token
     *
     * @return string
     */
    private static function toLocalizedVariable(string $componentPrefix, string $token): string
    {
        return '--' . $componentPrefix . '--' . $token;
    }

    /**
     * Format optional setting description.
     *
     * @param array<string, mixed> $setting Token setting data.
     *
     * @return string
     */
    private static function formatDescription(array $setting): string
    {
        if (isset($setting['description']) && is_string($setting['description']) && $setting['description'] !== '') {
            return $setting['description'];
        }

        if (isset($setting['label']) && is_string($setting['label']) && $setting['label'] !== '') {
            return $setting['label'];
        }

        return '-';
    }

    /**
     * Format available values for token settings.
     *
     * @param mixed $options Token options.
     *
     * @return string
     */
    private static function formatAvailableValues(mixed $options): string
    {
        if (!is_array($options) || $options === []) {
            return '-';
        }

        $values = [];
        foreach ($options as $option) {
            if (!is_array($option)) {
                continue;
            }

            $value = $option['value'] ?? null;
            if (is_string($value) && $value !== '') {
                $values[] = $value;
            }
        }

        return $values === [] ? '-' : implode(', ', $values);
    }

}
