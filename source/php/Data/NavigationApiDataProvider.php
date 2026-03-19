<?php

namespace MunicipioStyleGuide\Data;

use MunicipioStyleGuide\Contracts\JsonDataLoaderInterface;

/**
 * Provides JSON-backed payloads for navigation API endpoints.
 */
class NavigationApiDataProvider
{
    /**
     * @param JsonDataLoaderInterface $jsonDataLoader JSON data loader.
     */
    public function __construct(
        private JsonDataLoaderInterface $jsonDataLoader,
    ) {}

    /**
     * @param string $pageId Page identifier.
     *
     * @return array<mixed>|null
     */
    public function getTopNavPage(string $pageId): ?array
    {
        $payload = $this->jsonDataLoader->load('assets/data/topnav.json');
        $pages = $payload['pages'] ?? [];

        if (!is_array($pages)) {
            return null;
        }

        $page = $pages[$pageId] ?? null;
        return is_array($page) ? $page : null;
    }

    /**
     * @param string $parentId Parent identifier.
     *
     * @return array<mixed>
     */
    public function getSidebarChildren(string $parentId): array
    {
        $payload = $this->jsonDataLoader->load('assets/data/sidebar-children.json');
        $children = $payload['children'] ?? [];

        if (!is_array($children)) {
            return [];
        }

        $result = $children[$parentId] ?? $children['default'] ?? [];

        return is_array($result) ? $result : [];
    }
}
