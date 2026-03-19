<?php

namespace MunicipioStyleGuide\Http;

/**
 * Immutable HTTP request wrapper.
 */
class Request
{
    /**
     * @param string $requestUri Current request URI.
     * @param array<string, mixed> $queryParams Query parameters.
     */
    public function __construct(
        private string $requestUri,
        private array $queryParams,
    ) {}

    /**
     * Creates a request object from PHP globals.
     *
     * @return self
     */
    public static function fromGlobals(): self
    {
        return new self(
            $_SERVER['REQUEST_URI'] ?? '/',
            $_GET ?? [],
        );
    }

    /**
     * Returns current request path.
     *
     * @return string
     */
    public function getPath(): string
    {
        return parse_url($this->requestUri, PHP_URL_PATH) ?: '/';
    }

    /**
     * Returns first URI segment.
     *
     * @return string
     */
    public function getEndpoint(): string
    {
        $segments = explode('/', trim($this->getPath(), '/'));
        return strtolower($segments[0] ?? '');
    }

    /**
     * Gets query value by key.
     *
     * @param string $key Query key.
     *
     * @return string|null
     */
    public function getQuery(string $key): ?string
    {
        $value = $this->queryParams[$key] ?? null;
        return is_scalar($value) ? (string) $value : null;
    }

    /**
     * Checks if query key exists.
     *
     * @param string $key Query key.
     *
     * @return bool
     */
    public function hasQuery(string $key): bool
    {
        return array_key_exists($key, $this->queryParams);
    }

    /**
     * Resolves the page path used for blade view rendering.
     *
     * @param string $defaultPage Default page name.
     *
     * @return string
     */
    public function resolvePage(string $defaultPage = 'home'): string
    {
        if ($this->hasQuery('s')) {
            return 'search';
        }

        $path = trim($this->getPath(), '/');
        if ($path === '') {
            return $defaultPage;
        }

        $segments = array_values(array_filter(explode('/', $path), static fn (string $segment): bool => $segment !== ''));

        if (($segments[0] ?? '') === 'components') {
            return $this->resolveComponentPagePath($segments);
        }

        if (($segments[0] ?? '') === 'utilities') {
            return $this->resolveUtilityPagePath($segments);
        }

        return $path;
    }

    /**
     * Resolves a component view path without exposing atomic levels in URLs.
     *
     * @param array<int, string> $segments Request path segments.
     *
     * @return string
     */
    private function resolveComponentPagePath(array $segments): string
    {
        if (count($segments) !== 2) {
            return implode('/', $segments);
        }

        $componentSlug = $segments[1];
        if (in_array($componentSlug, ['atoms', 'molecules', 'organisms'], true)) {
            return implode('/', $segments);
        }

        if (!defined('BASEPATH')) {
            return implode('/', $segments);
        }

        $componentPath = BASEPATH . 'source/components/' . $componentSlug . '/component.json';
        if (is_file($componentPath)) {
            return 'component';
        }

        return implode('/', $segments);
    }

    /**
     * Resolves a utility view path based on utility metadata.
     *
     * @param array<int, string> $segments Request path segments.
     *
     * @return string
     */
    private function resolveUtilityPagePath(array $segments): string
    {
        if (count($segments) !== 2) {
            return implode('/', $segments);
        }

        if (!defined('BASEPATH')) {
            return implode('/', $segments);
        }

        $requestedSlug = strtolower((string) ($segments[1] ?? ''));
        $utilityConfigPaths = glob(BASEPATH . 'source/utilities/*/utility.json') ?: [];

        foreach ($utilityConfigPaths as $utilityConfigPath) {
            $configContent = file_get_contents($utilityConfigPath);
            $config = is_string($configContent) ? json_decode($configContent, true) : null;
            if (!is_array($config)) {
                continue;
            }

            if ($this->utilityConfigMatchesRequestedSlug($config, $utilityConfigPath, $requestedSlug)) {
                return 'utility';
            }
        }

        return implode('/', $segments);
    }

    /**
     * @param array<string, mixed> $config
     * @param string $utilityConfigPath
     * @param string $requestedSlug
     *
     * @return bool
     */
    private function utilityConfigMatchesRequestedSlug(array $config, string $utilityConfigPath, string $requestedSlug): bool
    {
        $requested = $this->normalizeIdentifier($requestedSlug);
        if ($requested === '') {
            return false;
        }

        $candidates = [];

        $slug = isset($config['slug']) ? (string) $config['slug'] : '';
        if ($slug !== '') {
            $candidates[] = $slug;
        }

        $folderName = basename(dirname($utilityConfigPath));
        if ($folderName !== '') {
            $candidates[] = $folderName;
        }

        $entries = $config['entries'] ?? null;
        if (is_array($entries)) {
            foreach (array_keys($entries) as $entryKey) {
                if (is_string($entryKey) && $entryKey !== '') {
                    $candidates[] = $entryKey;
                }
            }
        }

        foreach ($candidates as $candidate) {
            $normalizedCandidate = $this->normalizeIdentifier($candidate);
            if ($normalizedCandidate === '') {
                continue;
            }

            if ($requested === $normalizedCandidate) {
                return true;
            }

            if (rtrim($requested, 's') === rtrim($normalizedCandidate, 's')) {
                return true;
            }
        }

        return false;
    }

    /**
     * @param string $value
     *
     * @return string
     */
    private function normalizeIdentifier(string $value): string
    {
        return strtolower((string) preg_replace('/[^a-z0-9]/i', '', $value));
    }
}
