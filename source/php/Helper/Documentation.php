<?php


namespace MunicipioStyleGuide\Helper;

use HelsingborgStad\BladeService\BladeServiceInterface;

/**
 * Class Documentation
 * @package MunicipioStyleGuide\Helper
 */
class Documentation
{
    /**
     * Returns API rows for a vendor component.
     *
     * @param string $slug Component slug.
     * @param string|null $projectRoot Optional project root path.
     *
     * @return array<int, array<string, string>>
     */
    public static function getComponentApi(string $slug, ?string $projectRoot = null): array
    {
        $config = self::readComponentConfig($slug, $projectRoot);

        if ($config === null) {
            return [];
        }

        return self::buildParameterRows($config);
    }

    /**
     * Returns documented vendor subcomponents for a parent component.
     *
     * @param string $parentSlug Parent component slug.
     * @param string|null $projectRoot Optional project root path.
     *
     * @return array<int, array<string, mixed>>
     */
    public static function getSubcomponents(string $parentSlug, ?string $projectRoot = null): array
    {
        $componentsPath = self::getVendorComponentsPath($projectRoot);
        if (!is_dir($componentsPath)) {
            return [];
        }

        $normalizedParentSlug = self::normalizeIdentifier($parentSlug);
        $subcomponents = [];

        foreach (glob($componentsPath . '/*', GLOB_ONLYDIR) ?: [] as $directory) {
            $directoryName = basename($directory);
            if (stripos($directoryName, '__') === false) {
                continue;
            }

            $slug = self::resolveSlugFromDirectory($directory);
            if ($slug === null) {
                continue;
            }

            $slugParts = explode('__', $slug, 2);
            if (count($slugParts) !== 2) {
                continue;
            }

            if (self::normalizeIdentifier($slugParts[0]) !== $normalizedParentSlug) {
                continue;
            }

            $config = self::readJsonConfigFromDirectory($directory);
            if ($config === null) {
                continue;
            }

            $subcomponents[] = [
                'slug' => $slug,
                'name' => $slug,
                'anchor' => self::buildSubcomponentAnchor($slug),
                'purpose' => self::resolveSubcomponentPurpose($config, $parentSlug),
                'parameters' => self::appendCommonBladeParameters(self::buildParameterRows($config)),
            ];
        }

        usort(
            $subcomponents,
            static fn(array $left, array $right): int => strcmp((string) ($left['slug'] ?? ''), (string) ($right['slug'] ?? '')),
        );

        return $subcomponents;
    }

    /**
     * Returns the fragment anchor used for a documented subcomponent.
     *
     * @param string $slug Subcomponent slug.
     *
     * @return string
     */
    public static function buildSubcomponentAnchor(string $slug): string
    {
        $normalizedSlug = strtolower((string) preg_replace('/[^a-z0-9]+/i', '-', $slug));
        $normalizedSlug = trim($normalizedSlug, '-');

        return 'subcomponent-' . $normalizedSlug;
    }

    /**
     * @param $slug
     * @return array
     * @throws \Exception
     */
    public static function getUsageExamples(string $slug, BladeServiceInterface $blade)
    {
        $sourceExamplesDir = BASEPATH . 'source/components/' . $slug . '/examples';
        $examples = [];

        $examplesConfig = [];
        $sourceExamplesConfigPath = $sourceExamplesDir . '/examples.json';
        if (file_exists($sourceExamplesConfigPath)) {
            $sourceConfigContent = file_get_contents($sourceExamplesConfigPath);
            $sourceConfig = json_decode((string) $sourceConfigContent, true);
            if (is_array($sourceConfig)) {
                $examplesConfig = $sourceConfig;
            }
        }

        if (empty($examplesConfig) || !is_array($examplesConfig)) {
            return $examples;
        }

        foreach (array_keys($examplesConfig) as $exampleKey) {
            $filePath = $exampleKey . '.blade.php';
            $sourceBladePath = $sourceExamplesDir . '/' . $filePath;

            $includePath = null;
            $contentSourcePath = null;

            if (file_exists($sourceBladePath)) {
                $includePath = 'source.components.' . $slug . '.examples.' . $exampleKey;
                $contentSourcePath = $sourceBladePath;
            }

            if ($includePath === null || $contentSourcePath === null) {
                continue;
            }

            $html = $blade->makeView($includePath)->render();
            $content = file_get_contents($contentSourcePath, FILE_USE_INCLUDE_PATH);

            $description = is_array($examplesConfig[$exampleKey] ?? null) ? $examplesConfig[$exampleKey] : [];

            $normalizedDescription = [
                'heading' => $description['heading'] ?? '',
                'description' => $description['description'] ?? ($description['text'] ?? ''),
            ];

            $examples[] = [
                'component' => $includePath,
                'blade' => ['id' => uniqid('', true), 'code' => $content],
                'html' => ['id' => uniqid('', true), 'code' => $html],
                'description' => $normalizedDescription,
            ];
        }

        return $examples;
    }


    /**
     * @param $dir
     * @param $slug
     * @return mixed
     */
    public static function getJson($dir, $slug)
    {
        $configContent = file_get_contents($dir . '/' . $slug . '.json');
        $json = json_decode($configContent, true);
        return $json;
    }


    /**
     * @return array
     */
    public static function getComponentDirectories()
    {
        $atomic = ['atoms', 'molecules', 'organisms'];
        $results = [];
        foreach ($atomic as $atomicDir) {

            $dir = BASEPATH . '/views/pages/components/' . $atomicDir . '/';
            $files = scandir($dir);
            $results[$atomicDir] = [];
            foreach ($files as $key => $value) {
                if ($value !== "." &&
                    $value !== ".." &&
                    $value !== "" &&
                    $value !== ".dc_store") {

                    array_push($results[$atomicDir], str_replace('.blade.php', '', $value));
                }
            }
        }
        return array_filter($results);
    }

    /**
     * @param string $slug
     * @param string|null $projectRoot
     *
     * @return array<string, mixed>|null
     */
    private static function readComponentConfig(string $slug, ?string $projectRoot = null): ?array
    {
        $componentsPath = self::getVendorComponentsPath($projectRoot);
        if (!is_dir($componentsPath)) {
            return null;
        }

        $normalizedSlug = self::normalizeIdentifier($slug);

        foreach (glob($componentsPath . '/*', GLOB_ONLYDIR) ?: [] as $directory) {
            $directoryName = basename($directory);
            if (self::normalizeIdentifier($directoryName) !== $normalizedSlug) {
                continue;
            }

            return self::readJsonConfigFromDirectory($directory);
        }

        return null;
    }

    /**
     * @param array<string, mixed> $config
     *
     * @return array<int, array<string, string>>
     */
    private static function buildParameterRows(array $config): array
    {
        $settings = is_array($config['default'] ?? null) ? $config['default'] : [];
        $descriptions = is_array($config['description'] ?? null) ? $config['description'] : [];
        $types = is_array($config['types'] ?? null) ? $config['types'] : [];

        if ($settings === [] && $descriptions === [] && $types === []) {
            $proxyConfig = self::resolveProxyComponentConfig($config);
            if ($proxyConfig !== null) {
                $settings = is_array($proxyConfig['default'] ?? null) ? $proxyConfig['default'] : [];
                $descriptions = is_array($proxyConfig['description'] ?? null) ? $proxyConfig['description'] : [];
                $types = is_array($proxyConfig['types'] ?? null) ? $proxyConfig['types'] : [];
            }
        }

        $rows = [];
        foreach ($settings as $parameter => $defaultValue) {
            $rows[] = [
                'parameter' => (string) $parameter,
                'default' => self::stringifyDefaultValue($defaultValue),
                'type' => isset($types[$parameter]) ? (string) $types[$parameter] : self::resolvePhpType($defaultValue),
                'description' => isset($descriptions[$parameter]) && is_string($descriptions[$parameter]) ? $descriptions[$parameter] : '-',
            ];
        }

        return $rows;
    }

    /**
     * Appends shared Blade wrapper parameters to documented parameter rows.
     *
     * @param array<int, array<string, string>> $rows
     *
     * @return array<int, array<string, string>>
     */
    private static function appendCommonBladeParameters(array $rows): array
    {
        $rows[] = [
            'parameter' => 'classList',
            'default' => '[]',
            'type' => 'array',
            'description' => 'Additional CSS classes added to the wrapping element.',
        ];

        $rows[] = [
            'parameter' => 'attributeList',
            'default' => '[]',
            'type' => 'array',
            'description' => 'Additional HTML attributes added to the wrapping element.',
        ];

        return $rows;
    }

    /**
     * @param array<string, mixed> $config
     * @param string $parentSlug
     *
     * @return string
     */
    private static function resolveSubcomponentPurpose(array $config, string $parentSlug): string
    {
        $proxyConfig = self::resolveProxyComponentConfig($config);
        if ($proxyConfig !== null) {
            if (isset($proxyConfig['description']) && is_array($proxyConfig['description'])) {
                foreach ($proxyConfig['description'] as $description) {
                    if (is_string($description) && trim($description) !== '') {
                        return trim($description);
                    }
                }
            }
        }

        if (isset($config['purpose']) && is_string($config['purpose']) && trim($config['purpose']) !== '') {
            return trim($config['purpose']);
        }

        if (isset($config['description']) && is_string($config['description']) && trim($config['description']) !== '') {
            return trim($config['description']);
        }

        if (is_array($config['description'] ?? null)) {
            foreach ($config['description'] as $description) {
                if (is_string($description) && trim($description) !== '') {
                    return trim($description);
                }
            }
        }

        return sprintf('Subcomponent for the %s component.', $parentSlug);
    }

    /**
     * @param mixed $defaultValue
     *
     * @return string
     */
    private static function stringifyDefaultValue(mixed $defaultValue): string
    {
        if (is_bool($defaultValue)) {
            return $defaultValue ? 'true' : 'false';
        }

        if (is_array($defaultValue)) {
            return '[]';
        }

        if ($defaultValue === null) {
            return 'null';
        }

        return (string) $defaultValue;
    }

    /**
     * @param mixed $value
     *
     * @return string
     */
    private static function resolvePhpType(mixed $value): string
    {
        return gettype($value);
    }

    /**
     * @param string $directory
     *
     * @return array<string, mixed>|null
     */
    private static function readJsonConfigFromDirectory(string $directory): ?array
    {
        $jsonFiles = glob(rtrim($directory, '/') . '/*.json') ?: [];
        if (empty($jsonFiles)) {
            return null;
        }

        $content = file_get_contents($jsonFiles[0]);
        if (!is_string($content)) {
            return null;
        }

        $config = json_decode($content, true);

        return is_array($config) ? $config : null;
    }

    /**
     * Resolve passthrough component config for wrapper components that proxy to another component.
     *
     * @param array<string, mixed> $config
     *
     * @return array<string, mixed>|null
     */
    private static function resolveProxyComponentConfig(array $config): ?array
    {
        $view = $config['view'] ?? null;
        $slug = $config['slug'] ?? null;

        if (!is_string($view) || $view === '' || !is_string($slug) || $slug === '') {
            return null;
        }

        $viewPath = self::resolveComponentViewPath($slug, $view);
        if ($viewPath === null || !is_file($viewPath)) {
            return null;
        }

        $viewContent = file_get_contents($viewPath);
        if (!is_string($viewContent)) {
            return null;
        }

        if (!preg_match('/@([a-zA-Z0-9_]+)\(\$data\)/', $viewContent, $matches)) {
            return null;
        }

        $proxiedSlug = strtolower((string) $matches[1]);

        return self::readComponentConfig($proxiedSlug);
    }

    /**
     * Resolve the Blade view path for a vendor component.
     *
     * @param string $slug
     * @param string $view
     *
     * @return string|null
     */
    private static function resolveComponentViewPath(string $slug, string $view): ?string
    {
        $componentsPath = self::getVendorComponentsPath();
        if (!is_dir($componentsPath)) {
            return null;
        }

        $normalizedSlug = self::normalizeIdentifier($slug);

        foreach (glob($componentsPath . '/*', GLOB_ONLYDIR) ?: [] as $directory) {
            if (self::normalizeIdentifier(basename($directory)) !== $normalizedSlug) {
                continue;
            }

            return rtrim($directory, '/') . '/' . $view;
        }

        return null;
    }

    /**
     * @param string $directory
     *
     * @return string|null
     */
    private static function resolveSlugFromDirectory(string $directory): ?string
    {
        $config = self::readJsonConfigFromDirectory($directory);
        if ($config === null) {
            return null;
        }

        $slug = $config['slug'] ?? null;

        return is_string($slug) && $slug !== '' ? $slug : null;
    }

    /**
     * @param string|null $projectRoot
     *
     * @return string
     */
    private static function getVendorComponentsPath(?string $projectRoot = null): string
    {
        $root = $projectRoot ?? (defined('BASEPATH') ? rtrim((string) BASEPATH, '/') : getcwd());

        return rtrim((string) $root, '/') . '/vendor/helsingborg-stad/component-library/source/php/Component';
    }

    /**
     * @param string $value
     *
     * @return string
     */
    private static function normalizeIdentifier(string $value): string
    {
        return strtolower((string) preg_replace('/[^a-zA-Z0-9]/', '', $value));
    }

}