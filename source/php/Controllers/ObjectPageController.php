<?php

namespace MunicipioStyleGuide\Controllers;

/**
 * Controller for object documentation pages.
 */
class ObjectPageController extends PageController
{
    /**
     * Handles object page rendering.
     *
     * @return void
     */
    public function handle(): void
    {
        $page = $this->resolveObjectPage();
        $this->renderPage($page, $this->viewData());
    }

    /**
     * Returns data sent to object documentation views.
     *
     * @return array<string, mixed>
     */
    public function viewData(): array
    {
        $page = $this->resolveObjectPage();
        $data = $this->buildBaseViewData($page);

        $this->appendObjectsOverviewPageData($data, $page);

        return $data;
    }

    /**
     * Appends objects overview items to view data when on the objects overview page.
     *
     * @param array<string, mixed> $data
     * @param string $page
     *
     * @return void
     */
    private function appendObjectsOverviewPageData(array &$data, string $page): void
    {
        if ($page !== 'objects') {
            return;
        }

        $objectConfigPaths = glob(BASEPATH . 'source/objects/*/object.json') ?: [];
        $objectsOverviewItems = [];

        foreach ($objectConfigPaths as $objectConfigPath) {
            $configContent = file_get_contents($objectConfigPath);
            $config = is_string($configContent) ? json_decode($configContent, true) : null;
            if (!is_array($config)) {
                continue;
            }

            $slug = isset($config['slug']) ? strtolower((string) $config['slug']) : '';
            $name = isset($config['name']) ? (string) $config['name'] : '';

            if ($slug === '' || $name === '') {
                continue;
            }

            $objectsOverviewItems[] = [
                'slug' => $slug,
                'name' => $name,
                'description' => isset($config['description']) && is_string($config['description']) ? $config['description'] : '',
                'icon' => isset($config['icon']) && is_string($config['icon']) && $config['icon'] !== '' ? $config['icon'] : 'category',
                'href' => '/objects/' . $slug,
            ];
        }

        usort(
            $objectsOverviewItems,
            static fn(array $left, array $right): int => strcmp((string) ($left['name'] ?? ''), (string) ($right['name'] ?? '')),
        );

        $data['objectsOverviewItems'] = $objectsOverviewItems;
    }

    /**
     * @return string
     */
    private function resolveObjectPage(): string
    {
        $resolvedPage = $this->request->resolvePage('objects');

        if ($resolvedPage === 'objects' || str_starts_with($resolvedPage, 'objects/')) {
            return $resolvedPage;
        }

        return 'objects';
    }
}
