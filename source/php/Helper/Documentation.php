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

            if ($rows !== []) {
                return $rows;
            }
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
            $phpConfig = self::readPhpConfigFromFile(
                $phpConfigPath,
                !($jsonConfig !== null && self::hasParameterMetadata($jsonConfig))
            );
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
     * @param bool $includeTypedReflection
     *
     * @return array<string, mixed>|null
     */
    private static function readPhpConfigFromFile(string $path, bool $includeTypedReflection = true): ?array
    {
        $content = file_get_contents($path);
        if (!is_string($content)) {
            return null;
        }

        $config = self::parsePhpComponentConfig($content);
        if (!is_array($config)) {
            return null;
        }

        foreach (['default', 'types', 'description'] as $key) {
            if (isset($config[$key]) && is_object($config[$key])) {
                $config[$key] = (array) $config[$key];
            }
        }

        $existingParameters = is_array($config['parameters'] ?? null) ? $config['parameters'] : [];
        $typedParameters = $includeTypedReflection ? self::reflectTypedParameters($config['data'] ?? null) : [];
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
            $config['parameters'] = $existingParameters === []
                ? $typedParameters
                : self::mergeParameterDefinitions($existingParameters, $typedParameters);
        }

        return $config;
    }

    /**
     * @param string $content
     *
     * @return array<string, mixed>|null
     */
    private static function parsePhpComponentConfig(string $content): ?array
    {
        $tokens = token_get_all($content);
        $arguments = self::parsePhpNamedArguments($tokens);

        $slug = self::parsePhpStringArgument($arguments['slug'] ?? []);
        if ($slug === null || $slug === '') {
            return null;
        }

        $config = ['slug' => $slug];

        $view = self::parsePhpStringArgument($arguments['view'] ?? []);
        if ($view !== null && $view !== '') {
            $config['view'] = $view;
        }

        $dataClass = self::parsePhpDataClassArgument($arguments['data'] ?? [], $tokens);
        if ($dataClass !== null) {
            $config['data'] = $dataClass;
        }

        return $config;
    }

    /**
     * @param array<int, mixed> $tokens
     *
     * @return array<string, array<int, mixed>>
     */
    private static function parsePhpNamedArguments(array $tokens): array
    {
        $openParenthesisIndex = null;
        $tokenCount = count($tokens);

        for ($index = 0; $index < $tokenCount; $index++) {
            $token = $tokens[$index];
            if (!is_array($token) || $token[0] !== T_NEW) {
                continue;
            }

            $cursor = $index + 1;
            $className = '';

            while ($cursor < $tokenCount) {
                $candidate = $tokens[$cursor];
                if (self::isIgnorablePhpToken($candidate)) {
                    $cursor++;
                    continue;
                }

                if ($candidate === '(') {
                    break;
                }

                if (is_array($candidate) && in_array($candidate[0], [T_STRING, T_NS_SEPARATOR, T_NAME_QUALIFIED, T_NAME_FULLY_QUALIFIED], true)) {
                    $className .= $candidate[1];
                }

                $cursor++;
            }

            if ($cursor >= $tokenCount || $tokens[$cursor] !== '(') {
                continue;
            }

            $normalizedClassName = ltrim($className, '\\');
            if ($normalizedClassName !== '' && str_ends_with($normalizedClassName, 'ComponentConfig')) {
                $openParenthesisIndex = $cursor;
                break;
            }
        }

        if (!is_int($openParenthesisIndex)) {
            return [];
        }

        $arguments = [];
        $depth = 1;
        $currentArgumentTokens = [];

        for ($index = $openParenthesisIndex + 1; $index < $tokenCount; $index++) {
            $token = $tokens[$index];

            if ($token === '(' || $token === '[' || $token === '{') {
                $depth++;
            } elseif ($token === ')' || $token === ']' || $token === '}') {
                $depth--;
            }

            if (($token === ',' && $depth === 1) || ($token === ')' && $depth === 0)) {
                self::storeNamedArgument($arguments, $currentArgumentTokens);
                $currentArgumentTokens = [];

                if ($token === ')' && $depth === 0) {
                    break;
                }

                continue;
            }

            if ($depth > 0) {
                $currentArgumentTokens[] = $token;
            }
        }

        return $arguments;
    }

    /**
     * @param array<string, array<int, mixed>> $arguments
     * @param array<int, mixed> $argumentTokens
     *
     * @return void
     */
    private static function storeNamedArgument(array &$arguments, array $argumentTokens): void
    {
        $trimmedTokens = self::trimPhpTokens($argumentTokens);
        if ($trimmedTokens === []) {
            return;
        }

        $colonIndex = null;
        foreach ($trimmedTokens as $index => $token) {
            if ($token === ':') {
                $colonIndex = $index;
                break;
            }
        }

        if (!is_int($colonIndex) || $colonIndex === 0) {
            return;
        }

        $nameToken = $trimmedTokens[0];
        if (!is_array($nameToken) || $nameToken[0] !== T_STRING) {
            return;
        }

        $arguments[$nameToken[1]] = self::trimPhpTokens(array_slice($trimmedTokens, $colonIndex + 1));
    }

    /**
     * @param array<int, mixed> $argumentTokens
     *
     * @return string|null
     */
    private static function parsePhpStringArgument(array $argumentTokens): ?string
    {
        $tokens = self::trimPhpTokens($argumentTokens);
        if (count($tokens) !== 1) {
            return null;
        }

        $token = $tokens[0];
        if (!is_array($token) || $token[0] !== T_CONSTANT_ENCAPSED_STRING) {
            return null;
        }

        $literal = $token[1];
        $quote = substr($literal, 0, 1);
        if (($quote !== "'" && $quote !== '"') || substr($literal, -1) !== $quote) {
            return null;
        }

        return stripcslashes(substr($literal, 1, -1));
    }

    /**
     * @param array<int, mixed> $argumentTokens
     * @param array<int, mixed> $sourceTokens
     *
     * @return string|null
     */
    private static function parsePhpDataClassArgument(array $argumentTokens, array $sourceTokens): ?string
    {
        $tokens = self::trimPhpTokens($argumentTokens);
        if ($tokens === []) {
            return null;
        }

        while ($tokens !== [] && $tokens[0] === '(' && end($tokens) === ')') {
            $tokens = self::trimPhpTokens(array_slice($tokens, 1, -1));
        }

        if (
            count($tokens) === 1 &&
            is_array($tokens[0]) &&
            $tokens[0][0] === T_STRING &&
            strtolower($tokens[0][1]) === 'null'
        ) {
            return null;
        }

        $doubleColonIndex = null;
        foreach ($tokens as $index => $token) {
            if (is_array($token) && $token[0] === T_DOUBLE_COLON) {
                $doubleColonIndex = $index;
                break;
            }
        }

        if (!is_int($doubleColonIndex)) {
            return null;
        }

        $rightSideTokens = self::trimPhpTokens(array_slice($tokens, $doubleColonIndex + 1));
        if (count($rightSideTokens) !== 1 || !is_array($rightSideTokens[0]) || $rightSideTokens[0][0] !== T_CLASS) {
            return null;
        }

        $classNameTokens = self::trimPhpTokens(array_slice($tokens, 0, $doubleColonIndex));
        if ($classNameTokens === []) {
            return null;
        }

        $className = '';
        foreach ($classNameTokens as $token) {
            if (!is_array($token)) {
                return null;
            }

            if (!in_array($token[0], [T_STRING, T_NS_SEPARATOR, T_NAME_QUALIFIED, T_NAME_FULLY_QUALIFIED], true)) {
                return null;
            }

            $className .= $token[1];
        }

        if ($className === '') {
            return null;
        }

        return self::resolvePhpClassNameFromSource($className, $sourceTokens);
    }

    /**
     * @param string $className
     * @param array<int, mixed> $tokens
     *
     * @return string
     */
    private static function resolvePhpClassNameFromSource(string $className, array $tokens): string
    {
        $className = ltrim($className, '\\');
        if (str_contains($className, '\\')) {
            return $className;
        }

        foreach (self::parsePhpImports($tokens) as $alias => $importedClass) {
            if ($alias === $className) {
                return $importedClass;
            }
        }

        $namespace = self::parsePhpNamespace($tokens);
        if ($namespace === null || $namespace === '') {
            return $className;
        }

        return $namespace . '\\' . $className;
    }

    /**
     * @param array<int, mixed> $tokens
     *
     * @return array<string, string>
     */
    private static function parsePhpImports(array $tokens): array
    {
        $imports = [];
        $tokenCount = count($tokens);
        $scopeDepth = 0;

        for ($index = 0; $index < $tokenCount; $index++) {
            $token = $tokens[$index];

            if ($token === '{' || $token === '(' || $token === '[') {
                $scopeDepth++;
                continue;
            }

            if ($token === '}' || $token === ')' || $token === ']') {
                $scopeDepth = max(0, $scopeDepth - 1);
                continue;
            }

            if (!is_array($token)) {
                continue;
            }

            if (
                $scopeDepth === 0 &&
                (
                    ($token[0] === T_CLASS
                        && !self::isClassConstantToken($tokens, $index)
                        && !self::isAnonymousClassToken($tokens, $index)
                    )
                    || in_array($token[0], [T_INTERFACE, T_TRAIT, T_ENUM], true)
                )
            ) {
                break;
            }

            if (
                ($scopeDepth === 0) &&
                $token[0] === T_USE
            ) {
                $statementTokens = [];
                for ($cursor = $index + 1; $cursor < $tokenCount; $cursor++) {
                    $candidate = $tokens[$cursor];
                    if ($candidate === ';') {
                        $index = $cursor;
                        break;
                    }
                    $statementTokens[] = $candidate;
                }

                $statement = trim(self::stringifyPhpTokens($statementTokens));
                if ($statement === '' || str_starts_with(strtolower($statement), 'function ') || str_starts_with(strtolower($statement), 'const ')) {
                    continue;
                }

                foreach (self::parseUseStatement($statement) as $alias => $importedClass) {
                    $imports[$alias] = $importedClass;
                }
            }
        }

        return $imports;
    }

    /**
     * @param array<int, mixed> $tokens
     * @param int $index
     *
     * @return bool
     */
    private static function isAnonymousClassToken(array $tokens, int $index): bool
    {
        for ($cursor = $index - 1; $cursor >= 0; $cursor--) {
            $candidate = $tokens[$cursor];
            if (self::isIgnorablePhpToken($candidate)) {
                continue;
            }

            return is_array($candidate) && $candidate[0] === T_NEW;
        }

        return false;
    }

    /**
     * @param array<int, mixed> $tokens
     * @param int $index
     *
     * @return bool
     */
    private static function isClassConstantToken(array $tokens, int $index): bool
    {
        for ($cursor = $index - 1; $cursor >= 0; $cursor--) {
            $candidate = $tokens[$cursor];
            if (self::isIgnorablePhpToken($candidate)) {
                continue;
            }

            if ($candidate === ']') {
                $attributeDepth = 1;
                for ($attributeCursor = $cursor - 1; $attributeCursor >= 0; $attributeCursor--) {
                    $attributeToken = $tokens[$attributeCursor];
                    if (self::isIgnorablePhpToken($attributeToken)) {
                        continue;
                    }

                    if ($attributeToken === ']') {
                        $attributeDepth++;
                        continue;
                    }

                    if ($attributeToken === '[') {
                        $attributeDepth--;
                        if ($attributeDepth === 0) {
                            $cursor = $attributeCursor - 1;
                            continue 2;
                        }
                    }
                }
            }

            return is_array($candidate) && $candidate[0] === T_DOUBLE_COLON;
        }

        return false;
    }

    /**
     * @param string $statement
     *
     * @return array<string, string>
     */
    private static function parseUseStatement(string $statement): array
    {
        $imports = [];

        if (str_contains($statement, '{') && str_contains($statement, '}')) {
            $prefix = trim(substr($statement, 0, (int) strpos($statement, '{')));
            $prefix = rtrim(trim($prefix), '\\');
            $groupBody = trim((string) preg_replace('/^.*\{(.*)\}.*$/', '$1', $statement));
            $items = array_filter(array_map('trim', explode(',', $groupBody)));

            foreach ($items as $item) {
                $parts = preg_split('/\s+as\s+/i', $item);
                if (!is_array($parts) || trim($parts[0]) === '') {
                    continue;
                }

                $classPath = ltrim($prefix . '\\' . trim($parts[0]), '\\');
                $alias = isset($parts[1]) && trim($parts[1]) !== ''
                    ? trim($parts[1])
                    : basename(str_replace('\\', '/', trim($parts[0])));
                $imports[$alias] = $classPath;
            }

            return $imports;
        }

        foreach (array_filter(array_map('trim', explode(',', $statement))) as $item) {
            $parts = preg_split('/\s+as\s+/i', $item);
            if (!is_array($parts) || trim($parts[0]) === '') {
                continue;
            }

            $fullyQualifiedClass = ltrim(trim($parts[0]), '\\');
            $alias = isset($parts[1]) && trim($parts[1]) !== ''
                ? trim($parts[1])
                : basename(str_replace('\\', '/', $fullyQualifiedClass));
            $imports[$alias] = $fullyQualifiedClass;
        }

        return $imports;
    }

    /**
     * @param array<int, mixed> $tokens
     *
     * @return string|null
     */
    private static function parsePhpNamespace(array $tokens): ?string
    {
        $tokenCount = count($tokens);
        for ($index = 0; $index < $tokenCount; $index++) {
            $token = $tokens[$index];
            if (!is_array($token) || $token[0] !== T_NAMESPACE) {
                continue;
            }

            $namespace = '';
            for ($cursor = $index + 1; $cursor < $tokenCount; $cursor++) {
                $candidate = $tokens[$cursor];
                if ($candidate === ';' || $candidate === '{') {
                    return trim($namespace, '\\');
                }

                if (!is_array($candidate)) {
                    continue;
                }

                if (in_array($candidate[0], [T_STRING, T_NS_SEPARATOR, T_NAME_QUALIFIED], true)) {
                    $namespace .= $candidate[1];
                }
            }
        }

        return null;
    }

    /**
     * @param array<int, mixed> $tokens
     *
     * @return array<int, mixed>
     */
    private static function trimPhpTokens(array $tokens): array
    {
        while ($tokens !== [] && self::isIgnorablePhpToken($tokens[0])) {
            array_shift($tokens);
        }

        while ($tokens !== [] && self::isIgnorablePhpToken($tokens[count($tokens) - 1])) {
            array_pop($tokens);
        }

        return $tokens;
    }

    /**
     * @param mixed $token
     *
     * @return bool
     */
    private static function isIgnorablePhpToken(mixed $token): bool
    {
        return is_array($token) && in_array($token[0], [T_WHITESPACE, T_COMMENT, T_DOC_COMMENT], true);
    }

    /**
     * @param array<int, mixed> $tokens
     *
     * @return string
     */
    private static function stringifyPhpTokens(array $tokens): string
    {
        $string = '';
        foreach ($tokens as $token) {
            $string .= is_array($token) ? $token[1] : (string) $token;
        }

        return $string;
    }

    /**
     * @param array<string, mixed> $config
     *
     * @return bool
     */
    private static function hasParameterMetadata(array $config): bool
    {
        foreach (['default', 'types', 'description', 'parameters'] as $key) {
            if (!isset($config[$key])) {
                continue;
            }

            if (is_array($config[$key]) && $config[$key] !== []) {
                return true;
            }

            if (is_string($config[$key]) && trim($config[$key]) !== '') {
                return true;
            }
        }

        return false;
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
                if ($namedType instanceof \ReflectionNamedType) {
                    $types[] = self::normalizeReflectedTypeName($namedType->getName());
                    continue;
                }

                if ($namedType instanceof \ReflectionIntersectionType) {
                    $types[] = self::resolveIntersectionTypeName($namedType);
                }
            }

            $types = array_values(array_unique($types));
            if (count($types) === 2 && in_array('null', $types, true)) {
                $nonNullableNamedType = null;
                foreach ($namedTypes as $namedType) {
                    if ($namedType instanceof \ReflectionNamedType && strtolower($namedType->getName()) !== 'null') {
                        $nonNullableNamedType = $namedType;
                        break;
                    }
                }

                if (
                    $nonNullableNamedType instanceof \ReflectionNamedType &&
                    self::canUseNullableShorthand($nonNullableNamedType->getName())
                ) {
                    return '?' . self::normalizeReflectedTypeName($nonNullableNamedType->getName());
                }
            }

            return implode('|', $types);
        }

        if ($type instanceof \ReflectionNamedType) {
            $normalizedType = self::normalizeReflectedTypeName($type->getName());
            if ($type->allowsNull() && strtolower($type->getName()) !== 'null') {
                if ($normalizedType === 'mixed') {
                    return 'mixed';
                }

                if (self::canUseNullableShorthand($type->getName())) {
                    return '?' . $normalizedType;
                }

                return $normalizedType . '|null';
            }

            return $normalizedType;
        }

        if ($type instanceof \ReflectionIntersectionType) {
            return self::resolveIntersectionTypeName($type);
        }

        return 'mixed';
    }

    /**
     * @param \ReflectionIntersectionType $type
     *
     * @return string
     */
    private static function resolveIntersectionTypeName(\ReflectionIntersectionType $type): string
    {
        $segments = [];

        foreach ($type->getTypes() as $namedType) {
            $segments[] = self::normalizeReflectedTypeName($namedType->getName());
        }

        return implode('&', $segments);
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
     * @param array<int, mixed> $parameters
     *
     * @return array<int, array<string, mixed>>
     */
    private static function sanitizeParameterDefinitions(array $parameters): array
    {
        $validParameters = [];

        foreach ($parameters as $parameter) {
            if (is_array($parameter) && is_string($parameter['parameter'] ?? null) && $parameter['parameter'] !== '') {
                $validParameters[] = $parameter;
            }
        }

        return $validParameters;
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

        $hasJsonParametersKey = array_key_exists('parameters', $jsonConfig);
        $jsonParameters = is_array($jsonConfig['parameters'] ?? null) ? $jsonConfig['parameters'] : [];
        $validJsonParameters = self::sanitizeParameterDefinitions($jsonParameters);
        $currentParameters = is_array($merged['parameters'] ?? null) ? $merged['parameters'] : [];
        if ($hasJsonParametersKey && is_array($jsonConfig['parameters']) && $jsonParameters === []) {
            $merged['parameters'] = [];
            return $merged;
        }

        if ($validJsonParameters !== []) {
            $merged['parameters'] = $validJsonParameters;
            return $merged;
        }

        $merged['parameters'] = $currentParameters;

        return $merged;
    }

    /**
     * @param array<int, mixed> $primary
     * @param array<int, mixed> $fallback
     *
     * @return array<int, mixed>
     */
    private static function mergeParameterDefinitions(array $primary, array $fallback): array
    {
        $merged = $primary;
        $parameterIndexesByName = [];

        foreach ($merged as $index => $parameter) {
            if (is_array($parameter) && is_string($parameter['parameter'] ?? null)) {
                $parameterIndexesByName[$parameter['parameter']] = $index;
            }
        }

        foreach ($fallback as $fallbackParameter) {
            if (!is_array($fallbackParameter) || !is_string($fallbackParameter['parameter'] ?? null)) {
                continue;
            }

            $parameterName = $fallbackParameter['parameter'];
            if (!isset($parameterIndexesByName[$parameterName])) {
                $parameterIndexesByName[$parameterName] = count($merged);
                $merged[] = $fallbackParameter;
                continue;
            }

            $parameterIndex = $parameterIndexesByName[$parameterName];
            $existingParameter = $merged[$parameterIndex];
            if (is_array($existingParameter)) {
                $merged[$parameterIndex] = array_merge($fallbackParameter, $existingParameter);
            }
        }

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
            'null' => 'null',
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
        return !in_array(strtolower(ltrim($typeName, '\\')), ['mixed', 'null', 'false', 'true'], true);
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
        $declarations = [];
        $currentDeclaration = null;

        foreach (preg_split('/\R/', $docComment) ?: [] as $line) {
            if (preg_match('/^\s*\*\s*@param\b\s*(.*)$/', $line, $matches) === 1) {
                if ($currentDeclaration !== null) {
                    $declarations[] = trim($currentDeclaration);
                }

                $currentDeclaration = trim($matches[1]);
                continue;
            }

            if ($currentDeclaration === null) {
                continue;
            }

            if (preg_match('/^\s*\*\s*@\w+/', $line) === 1) {
                $declarations[] = trim($currentDeclaration);
                $currentDeclaration = null;
                continue;
            }

            if (preg_match('/^\s*\*\s?(.*)$/', $line, $matches) === 1) {
                $continuation = trim($matches[1]);
                if ($continuation !== '' && $continuation !== '/') {
                    $currentDeclaration = trim($currentDeclaration . ' ' . $continuation);
                }
            }
        }

        if ($currentDeclaration !== null) {
            $declarations[] = trim($currentDeclaration);
        }

        foreach ($declarations as $declaration) {
            if (preg_match('/^\S+\s+\$([a-zA-Z_][a-zA-Z0-9_]*)(?:\s+(.*))?$/', $declaration, $matches) !== 1) {
                continue;
            }

            $descriptions[$matches[1]] = trim($matches[2] ?? '');
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
