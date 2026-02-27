<?php

namespace HbgStyleGuide\Http;

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
        $path = trim($this->getPath(), '/');
        if ($path === '') {
            return $defaultPage;
        }

        $segments = array_values(array_filter(explode('/', $path), static fn (string $segment): bool => $segment !== ''));

        if (($segments[0] ?? '') === 'components') {
            return $this->resolveComponentPagePath($segments);
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
        if (in_array($componentSlug, ['atoms', 'molecules', 'organisms', 'usage'], true)) {
            return implode('/', $segments);
        }

        if (!defined('BASEPATH')) {
            return implode('/', $segments);
        }

        $componentLevels = ['atoms', 'molecules', 'organisms'];
        foreach ($componentLevels as $componentLevel) {
            $candidate = BASEPATH . 'views/pages/components/' . $componentLevel . '/' . $componentSlug . '.blade.php';
            if (is_file($candidate)) {
                return 'components/' . $componentLevel . '/' . $componentSlug;
            }
        }

        return implode('/', $segments);
    }
}
