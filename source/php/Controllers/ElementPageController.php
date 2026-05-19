<?php

namespace MunicipioStyleGuide\Controllers;

/**
 * Controller for element documentation pages.
 */
class ElementPageController extends PageController
{
    /**
     * Handles element page rendering.
     *
     * @return void
     */
    public function handle(): void
    {
        $page = $this->resolveElementPage();
        $this->renderPage($page, $this->viewData());
    }

    /**
     * Returns data sent to element documentation views.
     *
     * @return array<string, mixed>
     */
    public function viewData(): array
    {
        $page = $this->resolveElementPage();
        $data = $this->buildBaseViewData($page);

        $this->appendElementsOverviewPageData($data, $page);
        $this->appendElementPageData($data, $page);

        return $data;
    }

    /**
     * Appends element overview items to view data when on the elements overview page.
     *
     * @param array<string, mixed> $data
     * @param string $page
     *
     * @return void
     */
    private function appendElementsOverviewPageData(array &$data, string $page): void
    {
        if ($page !== 'elements') {
            return;
        }

        $elementConfigPaths = glob(BASEPATH . 'source/elements/*/element.json') ?: [];
        $elementsOverviewItems = [];

        foreach ($elementConfigPaths as $elementConfigPath) {
            $configContent = file_get_contents($elementConfigPath);
            $config = is_string($configContent) ? json_decode($configContent, true) : null;
            if (!is_array($config)) {
                continue;
            }

            $slug = isset($config['slug']) ? strtolower((string) $config['slug']) : '';
            $name = isset($config['name']) ? (string) $config['name'] : '';

            if ($slug === '' || $name === '') {
                continue;
            }

            $elementsOverviewItems[] = [
                'slug' => $slug,
                'name' => $name,
                'description' => isset($config['description']) && is_string($config['description']) ? $config['description'] : '',
                'icon' => isset($config['icon']) && is_string($config['icon']) && $config['icon'] !== '' ? $config['icon'] : 'code_blocks',
                'href' => '/elements/' . $slug,
            ];
        }

        usort(
            $elementsOverviewItems,
            static fn(array $left, array $right): int => strcmp((string) ($left['name'] ?? ''), (string) ($right['name'] ?? '')),
        );

        $data['elementsOverviewItems'] = $elementsOverviewItems;
    }

    /**
     * Appends element detail page data when on an element detail page.
     *
     * @param array<string, mixed> $data
     * @param string $page
     *
     * @return void
     */
    private function appendElementPageData(array &$data, string $page): void
    {
        if ($page !== 'element') {
            return;
        }

        $path = trim($this->request->getPath(), '/');
        $segments = array_values(array_filter(explode('/', $path), static fn(string $segment): bool => $segment !== ''));
        $slug = strtolower((string) ($segments[1] ?? ''));

        if ($slug === '') {
            return;
        }

        $elementConfigPath = BASEPATH . 'source/elements/' . $slug . '/element.json';
        if (!is_file($elementConfigPath)) {
            return;
        }

        $configContent = file_get_contents($elementConfigPath);
        $config = is_string($configContent) ? json_decode($configContent, true) : null;
        if (!is_array($config)) {
            return;
        }

        $headline = isset($config['name']) && is_string($config['name']) && $config['name'] !== '' ? $config['name'] : ucfirst($slug);
        $description = isset($config['description']) && is_string($config['description']) ? $config['description'] : '';
        $icon = isset($config['icon']) && is_string($config['icon']) && $config['icon'] !== '' ? $config['icon'] : 'code_blocks';
        $documentationConfig = isset($config['documentationConfig']) && is_string($config['documentationConfig']) && $config['documentationConfig'] !== '' ? $config['documentationConfig'] : $headline;

        $data['slug'] = $slug;
        $data['headline'] = $headline;
        $data['componentIcon'] = $icon;
        $data['description'] = $description;
        $data['pageNow'] = 'elements/' . $slug;
        $data['viewDoc'] = [
            'type' => 'elements',
            'root' => $slug,
            'config' => $documentationConfig,
        ];
    }

    /**
     * @return string
     */
    private function resolveElementPage(): string
    {
        $resolvedPage = $this->request->resolvePage('elements');

        if ($resolvedPage === 'elements' || $resolvedPage === 'element' || str_starts_with($resolvedPage, 'elements/')) {
            return $resolvedPage;
        }

        return 'elements';
    }
}
