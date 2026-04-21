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
        $componentSettings = self::extractComponentSettings($componentConfig);

        if ($componentTokens === [] && $componentSettings === []) {
            return [];
        }

        return self::resolveParametersFromTokens($slug, $componentTokens, $componentSettings, $designTokensConfig);
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
                static fn(mixed $token): bool => is_string($token) && $token !== '',
            ),
        );
    }

    /**
     * Extract component-local design builder settings from component config.
     *
     * @param array<string, mixed> $componentConfig Component config data.
     *
     * @return array<int, array<string, mixed>>
     */
    private static function extractComponentSettings(array $componentConfig): array
    {
        if (!isset($componentConfig['componentSettings']) || !is_array($componentConfig['componentSettings'])) {
            return [];
        }

        return array_values(
            array_filter(
                $componentConfig['componentSettings'],
                static fn(mixed $category): bool => is_array($category),
            ),
        );
    }

    /**
     * Resolve design-token settings into display-ready CSS parameter declarations.
     *
     * @param string $slug Component slug.
     * @param array<int, string> $componentTokens Tokens declared in component.json.
     * @param array<int, array<string, mixed>> $componentSettings Component-local setting categories.
     * @param array<string, mixed> $designTokensConfig Parsed design token config.
     *
     * @return array<int, array<string, string>>
     */
    private static function resolveParametersFromTokens(string $slug, array $componentTokens, array $componentSettings, array $designTokensConfig): array
    {
        $categories = $designTokensConfig['categories'] ?? [];
        if (!is_array($categories)) {
            return self::buildLocalizedRows($slug, $componentTokens, [], $componentSettings);
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

        return self::buildLocalizedRows($slug, $componentTokens, $settingsByToken, $componentSettings);
    }

    /**
     * Build localized CSS variable rows using component token declarations.
     *
     * @param string $slug
     * @param array<int, string> $componentTokens
     * @param array<string, array<string, mixed>> $settingsByToken
     * @param array<int, array<string, mixed>> $componentSettings
     *
     * @return array<int, array<string, string>>
     */
    private static function buildLocalizedRows(string $slug, array $componentTokens, array $settingsByToken, array $componentSettings): array
    {
        $componentPrefix = 'c-' . $slug;

        $rows = [];
        $rowIndexesByVariable = [];

        foreach ($componentTokens as $token) {
            self::upsertRow(
                $rows,
                $rowIndexesByVariable,
                self::toLocalizedVariable($componentPrefix, $token),
                'var(--' . $token . ')',
                $settingsByToken[$token] ?? null,
            );
        }

        foreach ($componentSettings as $category) {
            $settings = isset($category['settings']) && is_array($category['settings']) ? $category['settings'] : [];

            foreach ($settings as $setting) {
                if (!is_array($setting)) {
                    continue;
                }

                $variable = $setting['variable'] ?? null;
                if (is_string($variable) && str_starts_with($variable, '--')) {
                    self::upsertRow(
                        $rows,
                        $rowIndexesByVariable,
                        self::toLocalizedVariable($componentPrefix, ltrim($variable, '-')),
                        isset($setting['default']) ? (string) $setting['default'] : '',
                        $setting,
                    );
                    continue;
                }

                $resolvedTokenSetting = self::resolveTokenBackedSetting($setting, $componentTokens, $settingsByToken);
                if ($resolvedTokenSetting === null) {
                    continue;
                }

                $token = (string) $resolvedTokenSetting['token'];
                self::upsertRow(
                    $rows,
                    $rowIndexesByVariable,
                    self::toLocalizedVariable($componentPrefix, $token),
                    'var(--' . $token . ')',
                    $resolvedTokenSetting,
                    true,
                );
            }
        }

        return $rows;
    }

    /**
     * Resolve a token-backed component setting against the declared tokens and global token definitions.
     *
     * @param array<string, mixed> $setting
     * @param array<int, string> $componentTokens
     * @param array<string, array<string, mixed>> $settingsByToken
     *
     * @return array<string, mixed>|null
     */
    private static function resolveTokenBackedSetting(array $setting, array $componentTokens, array $settingsByToken): ?array
    {
        $token = $setting['token'] ?? null;
        if (!is_string($token) || $token === '' || !in_array($token, $componentTokens, true)) {
            return null;
        }

        $tokenSetting = $settingsByToken[$token] ?? null;
        if (!is_array($tokenSetting)) {
            return null;
        }

        $resolved = $tokenSetting;
        $resolved['token'] = $token;

        if (isset($setting['label']) && is_string($setting['label']) && trim($setting['label']) !== '') {
            $resolved['label'] = trim($setting['label']);
        }

        if (isset($setting['description']) && is_string($setting['description']) && trim($setting['description']) !== '') {
            $resolved['description'] = trim($setting['description']);
        }

        return $resolved;
    }

    /**
     * Build a CSS parameter row.
     *
     * @param string $localizedVariable
     * @param string $defaultValue
     * @param array<string, mixed>|null $setting
     *
     * @return array<string, string>
     */
    private static function buildRow(string $localizedVariable, string $defaultValue, ?array $setting): array
    {
        return [
            'key' => $localizedVariable,
            'defaultValue' => $defaultValue,
            'type' => is_array($setting) && isset($setting['type']) && is_string($setting['type']) ? $setting['type'] : '-',
            'availableValues' => self::formatAvailableValues(is_array($setting) ? $setting['options'] ?? null : null),
            'description' => self::formatDescription($setting ?? []),
        ];
    }

    /**
     * Append or enrich a CSS parameter row.
     *
     * @param array<int, array<string, string>> $rows
     * @param array<string, int> $rowIndexesByVariable
     * @param string $localizedVariable
     * @param string $defaultValue
     * @param array<string, mixed>|null $setting
     * @param bool $enrichExisting
     *
     * @return void
     */
    private static function upsertRow(array &$rows, array &$rowIndexesByVariable, string $localizedVariable, string $defaultValue, ?array $setting, bool $enrichExisting = false): void
    {
        $row = self::buildRow($localizedVariable, $defaultValue, $setting);

        if (!isset($rowIndexesByVariable[$localizedVariable])) {
            $rowIndexesByVariable[$localizedVariable] = count($rows);
            $rows[] = $row;
            return;
        }

        if (!$enrichExisting) {
            return;
        }

        $existingIndex = $rowIndexesByVariable[$localizedVariable];
        if ($rows[$existingIndex]['type'] === '-' && $row['type'] !== '-') {
            $rows[$existingIndex]['type'] = $row['type'];
        }

        if ($rows[$existingIndex]['availableValues'] === '-' && $row['availableValues'] !== '-') {
            $rows[$existingIndex]['availableValues'] = $row['availableValues'];
        }

        if ($row['description'] !== '-') {
            $rows[$existingIndex]['description'] = $row['description'];
        }
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
