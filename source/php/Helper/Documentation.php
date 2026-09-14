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

            $effectiveConfig = self::resolveEffectiveComponentConfig($config, $projectRoot);

            $subcomponents[] = [
                'slug' => $slug,
                'name' => $slug,
                'displayName' => self::buildReadableSubcomponentName($slug),
                'directive' => '@' . $slug . '()',
                'anchor' => self::buildSubcomponentAnchor($slug),
                'purpose' => self::resolveSubcomponentPurpose($config, $parentSlug, $projectRoot),
                'parameters' => self::appendCommonBladeParameters(self::buildParameterRows($config, $projectRoot)),
                'usageExample' => self::buildUsageExample($slug, $effectiveConfig),
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
                'description' => $description['description'] ?? $description['text'] ?? '',
            ];

            $examples[] = [
                'component' => $includePath,
                'blade' => ['id' => uniqid('', true), 'code' => $content],
                'html' => ['id' => uniqid('', true), 'code' => $html],
                'description' => $normalizedDescription,
                'includePaper' => ($description['includePaper'] ?? true) !== false,
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
                if ($value !== '.' && $value !== '..' && $value !== '' && $value !== '.dc_store') {
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
    private static function buildParameterRows(array $config, ?string $projectRoot = null): array
    {
        $effectiveConfig = self::resolveEffectiveComponentConfig($config, $projectRoot);
        $typedParameters = is_array($effectiveConfig['parameters'] ?? null) ? $effectiveConfig['parameters'] : [];

        if ($typedParameters !== []) {
            $rows = [];
            foreach ($typedParameters as $typedParameter) {
                if (!is_array($typedParameter) || !is_string($typedParameter['parameter'] ?? null)) {
                    continue;
                }

                $rows[] = [
                    'parameter' => $typedParameter['parameter'],
                    'default' => ($typedParameter['hasDefault'] ?? false) === true
                        ? self::stringifyDefaultValue($typedParameter['default'] ?? null)
                        : '-',
                    'type' => is_string($typedParameter['type'] ?? null) ? $typedParameter['type'] : 'mixed',
                    'description' => is_string($typedParameter['description'] ?? null)
                        && trim($typedParameter['description']) !== ''
                        ? trim($typedParameter['description'])
                        : '-',
                ];
            }

            return $rows;
        }

        $settings = is_array($effectiveConfig['default'] ?? null) ? $effectiveConfig['default'] : [];
        $descriptions = is_array($effectiveConfig['description'] ?? null) ? $effectiveConfig['description'] : [];
        $types = is_array($effectiveConfig['types'] ?? null) ? $effectiveConfig['types'] : [];

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
    private static function resolveSubcomponentPurpose(array $config, string $parentSlug, ?string $projectRoot = null): string
    {
        $proxyConfig = self::resolveProxyComponentConfig($config, $projectRoot);
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
        $jsonConfig = null;
        if (!empty($jsonFiles)) {
            $content = file_get_contents($jsonFiles[0]);
            if (is_string($content)) {
                $parsedJson = json_decode($content, true);
                if (is_array($parsedJson)) {
                    $jsonConfig = $parsedJson;
                }
            }
        }

        $phpConfigPath = rtrim($directory, '/') . '/config.php';
        $phpConfig = null;
        if (is_file($phpConfigPath)) {
            $phpConfig = self::readPhpConfigFromFile($phpConfigPath);
        }

        if ($jsonConfig !== null && $phpConfig !== null) {
            return self::mergePhpAndJsonConfig($phpConfig, $jsonConfig);
        }

        if ($jsonConfig !== null) {
            return $jsonConfig;
        }

        return $phpConfig;
    }

    /**
     * @param string $path
     *
     * @return array<string, mixed>|null
     */
    private static function readPhpConfigFromFile(string $path): ?array
    {
        try {
            $config = require $path;
        } catch (\Throwable) {
            return null;
        }

        if (is_object($config)) {
            $config = get_object_vars($config);
        }

        if (!is_array($config)) {
            return null;
        }

        if (isset($config['data']) && is_object($config['data'])) {
            $config['data'] = get_class($config['data']);
        }

        foreach (['default', 'types', 'description'] as $key) {
            if (isset($config[$key]) && is_object($config[$key])) {
                $config[$key] = (array) $config[$key];
            }
        }

        $typedParameters = self::reflectTypedParameters($config['data'] ?? null);
        if ($typedParameters !== []) {
            $defaults = is_array($config['default'] ?? null) ? $config['default'] : [];
            $types = is_array($config['types'] ?? null) ? $config['types'] : [];
            $descriptions = is_array($config['description'] ?? null) ? $config['description'] : [];

            foreach ($typedParameters as $typedParameter) {
                $parameterName = $typedParameter['parameter'];
                if (!is_string($parameterName) || $parameterName === '') {
                    continue;
                }

                if (($typedParameter['hasDefault'] ?? false) === true && !array_key_exists($parameterName, $defaults)) {
                    $defaults[$parameterName] = $typedParameter['default'] ?? null;
                }

                if (!isset($types[$parameterName]) && is_string($typedParameter['type'] ?? null)) {
                    $types[$parameterName] = $typedParameter['type'];
                }

                if (
                    !isset($descriptions[$parameterName]) &&
                    is_string($typedParameter['description'] ?? null) &&
                    trim($typedParameter['description']) !== ''
                ) {
                    $descriptions[$parameterName] = trim($typedParameter['description']);
                }
            }

            $config['default'] = $defaults;
            $config['types'] = $types;
            $config['description'] = $descriptions;
            $config['parameters'] = $typedParameters;
        }

        return $config;
    }

    /**
     * @param mixed $dataClass
     *
     * @return array<int, array<string, mixed>>
     */
    private static function reflectTypedParameters(mixed $dataClass): array
    {
        if (!is_string($dataClass) || $dataClass === '' || !class_exists($dataClass)) {
            return [];
        }

        try {
            $reflectionClass = new \ReflectionClass($dataClass);
            $constructor = $reflectionClass->getConstructor();
        } catch (\ReflectionException) {
            return [];
        }

        if (!$constructor instanceof \ReflectionMethod) {
            return [];
        }

        $descriptions = self::extractParameterDescriptions((string) $constructor->getDocComment());
        $parameters = [];

        foreach ($constructor->getParameters() as $parameter) {
            $name = $parameter->getName();
            $hasDefault = $parameter->isDefaultValueAvailable();

            $parameters[] = [
                'parameter' => $name,
                'hasDefault' => $hasDefault,
                'default' => $hasDefault ? $parameter->getDefaultValue() : null,
                'type' => self::resolveReflectedParameterType($parameter),
                'description' => isset($descriptions[$name]) && trim($descriptions[$name]) !== ''
                    ? trim($descriptions[$name])
                    : '-',
            ];
        }

        return $parameters;
    }

    /**
     * @param \ReflectionParameter $parameter
     *
     * @return string
     */
    private static function resolveReflectedParameterType(\ReflectionParameter $parameter): string
    {
        $type = $parameter->getType();

        if ($type instanceof \ReflectionUnionType) {
            $namedTypes = $type->getTypes();
            $types = [];
            foreach ($namedTypes as $namedType) {
                $types[] = self::normalizeReflectedTypeName($namedType->getName());
            }

            $types = array_values(array_unique($types));
            if (count($types) === 2 && in_array('NULL', $types, true)) {
                $nonNullableNamedType = null;
                foreach ($namedTypes as $namedType) {
                    if (strtolower($namedType->getName()) !== 'null') {
                        $nonNullableNamedType = $namedType;
                        break;
                    }
                }

                if (
                    $nonNullableNamedType instanceof \ReflectionNamedType &&
                    self::canUseNullableShorthand($nonNullableNamedType->getName())
                ) {
                    return '?' . ltrim($nonNullableNamedType->getName(), '\\');
                }
            }

            return implode('|', $types);
        }

        if ($type instanceof \ReflectionNamedType) {
            $normalizedType = self::normalizeReflectedTypeName($type->getName());
            if ($type->allowsNull() && strtolower($type->getName()) !== 'null') {
                if (self::canUseNullableShorthand($type->getName())) {
                    return '?' . ltrim($type->getName(), '\\');
                }

                return $normalizedType . '|NULL';
            }

            return $normalizedType;
        }

        return 'mixed';
    }

    /**
     * @param array<string, mixed> $primary
     * @param array<string, mixed> $fallback
     *
     * @return array<string, mixed>
     */
    private static function mergeConfigWithFallback(array $primary, array $fallback): array
    {
        $merged = $primary;

        foreach (['slug', 'view', 'data'] as $key) {
            if (!isset($merged[$key]) && isset($fallback[$key])) {
                $merged[$key] = $fallback[$key];
            }
        }

        foreach (['default', 'types', 'description'] as $key) {
            $primaryValues = is_array($merged[$key] ?? null) ? $merged[$key] : [];
            $fallbackValues = is_array($fallback[$key] ?? null) ? $fallback[$key] : [];

            if ($primaryValues === [] && $fallbackValues !== []) {
                $merged[$key] = $fallbackValues;
                continue;
            }

            foreach ($fallbackValues as $parameter => $value) {
                if (!array_key_exists($parameter, $primaryValues)) {
                    $primaryValues[$parameter] = $value;
                }
            }

            if ($primaryValues !== []) {
                $merged[$key] = $primaryValues;
            }
        }

        $primaryParameters = is_array($merged['parameters'] ?? null) ? $merged['parameters'] : [];
        $fallbackParameters = is_array($fallback['parameters'] ?? null) ? $fallback['parameters'] : [];

        if ($primaryParameters === [] && $fallbackParameters !== []) {
            $merged['parameters'] = $fallbackParameters;
        } elseif ($primaryParameters !== [] && $fallbackParameters !== []) {
            $parameterIndexesByName = [];
            foreach ($primaryParameters as $index => $primaryParameter) {
                if (is_array($primaryParameter) && is_string($primaryParameter['parameter'] ?? null)) {
                    $parameterIndexesByName[$primaryParameter['parameter']] = $index;
                }
            }

            foreach ($fallbackParameters as $fallbackParameter) {
                if (!is_array($fallbackParameter) || !is_string($fallbackParameter['parameter'] ?? null)) {
                    continue;
                }

                $parameterName = $fallbackParameter['parameter'];
                if (isset($parameterIndexesByName[$parameterName])) {
                    $parameterIndex = $parameterIndexesByName[$parameterName];
                    $existingParameter = $primaryParameters[$parameterIndex];
                    if (is_array($existingParameter)) {
                        $primaryParameters[$parameterIndex] = array_merge($fallbackParameter, $existingParameter);
                    }
                    continue;
                }

                $parameterIndexesByName[$parameterName] = count($primaryParameters);
                $primaryParameters[] = $fallbackParameter;
            }

            $merged['parameters'] = $primaryParameters;
        }

        return $merged;
    }

    /**
     * @param array<string, mixed> $phpConfig
     * @param array<string, mixed> $jsonConfig
     *
     * @return array<string, mixed>
     */
    private static function mergePhpAndJsonConfig(array $phpConfig, array $jsonConfig): array
    {
        $merged = self::mergeConfigWithFallback($phpConfig, $jsonConfig);

        $jsonParameters = is_array($jsonConfig['parameters'] ?? null) ? $jsonConfig['parameters'] : [];
        $currentParameters = is_array($merged['parameters'] ?? null) ? $merged['parameters'] : [];
        if ($jsonParameters === [] || $currentParameters === []) {
            return $merged;
        }

        $parameterIndexesByName = [];
        foreach ($currentParameters as $index => $parameter) {
            if (is_array($parameter) && is_string($parameter['parameter'] ?? null)) {
                $parameterIndexesByName[$parameter['parameter']] = $index;
            }
        }

        foreach ($jsonParameters as $jsonParameter) {
            if (!is_array($jsonParameter) || !is_string($jsonParameter['parameter'] ?? null)) {
                continue;
            }

            $parameterName = $jsonParameter['parameter'];
            if (!isset($parameterIndexesByName[$parameterName])) {
                $parameterIndexesByName[$parameterName] = count($currentParameters);
                $currentParameters[] = $jsonParameter;
                continue;
            }

            $parameterIndex = $parameterIndexesByName[$parameterName];
            $existingParameter = $currentParameters[$parameterIndex];
            if (is_array($existingParameter)) {
                $currentParameters[$parameterIndex] = array_merge($jsonParameter, $existingParameter);
            }
        }

        $merged['parameters'] = $currentParameters;

        return $merged;
    }

    /**
     * @param string $typeName
     *
     * @return string
     */
    private static function normalizeReflectedTypeName(string $typeName): string
    {
        return match ($typeName) {
            'bool' => 'boolean',
            'int' => 'integer',
            'float' => 'float',
            'null' => 'NULL',
            default => ltrim($typeName, '\\'),
        };
    }

    /**
     * @param string $typeName
     *
     * @return bool
     */
    private static function canUseNullableShorthand(string $typeName): bool
    {
        return !in_array(strtolower(ltrim($typeName, '\\')), ['bool', 'int', 'mixed', 'null', 'false', 'true'], true);
    }

    /**
     * @param string $docComment
     *
     * @return array<string, string>
     */
    private static function extractParameterDescriptions(string $docComment): array
    {
        if ($docComment === '') {
            return [];
        }

        $descriptions = [];
        $currentParameter = null;

        foreach (preg_split('/\R/', $docComment) ?: [] as $line) {
            if (preg_match('/^\s*\*\s*@param\s+\S+\s+\$([a-zA-Z_][a-zA-Z0-9_]*)\s*(.*)$/', $line, $matches) === 1) {
                $currentParameter = $matches[1];
                $descriptions[$currentParameter] = trim($matches[2] ?? '');
                continue;
            }

            if ($currentParameter === null) {
                continue;
            }

            if (preg_match('/^\s*\*\s*@\w+/', $line) === 1) {
                $currentParameter = null;
                continue;
            }

            if (preg_match('/^\s*\*\s?(.*)$/', $line, $matches) === 1) {
                $continuation = trim($matches[1]);
                if ($continuation !== '' && $continuation !== '/') {
                    $descriptions[$currentParameter] = trim(($descriptions[$currentParameter] ?? '') . ' ' . $continuation);
                }
            }
        }

        return $descriptions;
    }

    /**
     * Resolve the effective config for a component, including passthrough wrappers.
     *
     * @param array<string, mixed> $config
     * @param string|null $projectRoot
     *
     * @return array<string, mixed>
     */
    private static function resolveEffectiveComponentConfig(array $config, ?string $projectRoot = null): array
    {
        $settings = is_array($config['default'] ?? null) ? $config['default'] : [];
        $descriptions = is_array($config['description'] ?? null) ? $config['description'] : [];
        $types = is_array($config['types'] ?? null) ? $config['types'] : [];

        if ($settings !== [] || $descriptions !== [] || $types !== []) {
            return $config;
        }

        return self::resolveProxyComponentConfig($config, $projectRoot) ?? $config;
    }

    /**
     * Resolve passthrough component config for wrapper components that proxy to another component.
     *
     * @param array<string, mixed> $config
     * @param string|null $projectRoot
     *
     * @return array<string, mixed>|null
     */
    private static function resolveProxyComponentConfig(array $config, ?string $projectRoot = null): ?array
    {
        $view = $config['view'] ?? null;
        $slug = $config['slug'] ?? null;

        if (!is_string($view) || $view === '' || !is_string($slug) || $slug === '') {
            return null;
        }

        $viewPath = self::resolveComponentViewPath($slug, $view, $projectRoot);
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

        return self::readComponentConfig($proxiedSlug, $projectRoot);
    }

    /**
     * Resolve the Blade view path for a vendor component.
     *
     * @param string $slug
     * @param string $view
     *
     * @return string|null
     */
    private static function resolveComponentViewPath(string $slug, string $view, ?string $projectRoot = null): ?string
    {
        $componentsPath = self::getVendorComponentsPath($projectRoot);
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
     * Build a readable name from a subcomponent slug.
     *
     * @param string $slug
     *
     * @return string
     */
    private static function buildReadableSubcomponentName(string $slug): string
    {
        $label = str_replace(['__', '_'], ' ', $slug);

        return ucwords($label);
    }

    /**
     * Build a generated Blade usage example for a subcomponent.
     *
     * @param string $slug
     * @param array<string, mixed> $config
     *
     * @return string
     */
    private static function buildUsageExample(string $slug, array $config): string
    {
        $defaults = is_array($config['default'] ?? null) ? $config['default'] : [];
        $hasSlot = array_key_exists('slot', $defaults);
        unset($defaults['slot']);

        $lines = [];

        if ($defaults === []) {
            $lines[] = '@' . $slug . '()';
        } else {
            $lines[] = '@' . $slug . '([';
            foreach ($defaults as $parameter => $defaultValue) {
                $formattedValue = self::formatPhpValue($defaultValue, 1);

                if (is_array($defaultValue)) {
                    $lines[] = '    ' . var_export($parameter, true) . ' => ' . $formattedValue . ',';
                    continue;
                }

                $lines[] = '    ' . var_export($parameter, true) . ' => ' . $formattedValue . ',';
            }
            $lines[] = '])';
        }

        if ($hasSlot) {
            $lines[] = '    Slot content';
        }

        $lines[] = '@end' . $slug;

        return implode("\n", $lines);
    }

    /**
     * Format a PHP value as short-array syntax for generated Blade examples.
     *
     * @param mixed $value
     * @param int $indentLevel
     *
     * @return string
     */
    private static function formatPhpValue(mixed $value, int $indentLevel = 0): string
    {
        if (is_array($value)) {
            if ($value === []) {
                return '[]';
            }

            $indent = str_repeat('    ', $indentLevel);
            $childIndent = str_repeat('    ', $indentLevel + 1);
            $lines = ['['];

            foreach ($value as $key => $item) {
                $formattedKey = is_int($key) ? '' : var_export($key, true) . ' => ';
                $formattedValue = self::formatPhpValue($item, $indentLevel + 1);
                $lines[] = $childIndent . $formattedKey . $formattedValue . ',';
            }

            $lines[] = $indent . ']';

            return implode("\n", $lines);
        }

        if (is_bool($value)) {
            return $value ? 'true' : 'false';
        }

        if ($value === null) {
            return 'null';
        }

        return var_export($value, true);
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
