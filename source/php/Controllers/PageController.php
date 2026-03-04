<?php

namespace HbgStyleGuide\Controllers;

use HbgStyleGuide\Asset;
use HbgStyleGuide\Contracts\ControllerInterface;
use HbgStyleGuide\Navigation;
use HbgStyleGuide\Search\Search;
use HbgStyleGuide\View;
use HelsingborgStad\BladeService\BladeServiceInterface;

/**
 * Controller for page rendering.
 */
class PageController extends BaseController implements ControllerInterface
{
    /**
     * @param \HelsingborgStad\BladeService\BladeServiceInterface $bladeService Blade service.
     * @param View $view View renderer.
     * @param Navigation $navigation Navigation service.
     * @param Search $search Search service.
     */
    public function __construct(
        \HbgStyleGuide\Http\Request $request,
        \HbgStyleGuide\Http\Response $response,
        private BladeServiceInterface $bladeService,
        private View $view,
        private Navigation $navigation,
        private Search $search,
    ) {
        parent::__construct($request, $response);
    }

    /**
     * Handles page request rendering.
     *
     * @return void
     */
    public function handle(): void
    {
        $page = $this->request->resolvePage();

        $data = [
            'assets' => Asset::getAll(),
            'topNavigation' => $this->navigation->buildItems('pages/', [], false),
            'sideNavigation' => $this->navigation->buildSidebarNavigation(),
            'pageNow' => $page,
        ];

        $this->appendComponentPageData($data, $page);
        $this->appendComponentsOverviewPageData($data, $page);
        $this->appendUtilitiesOverviewPageData($data, $page);
        $this->appendSearchPageData($data, $page);

        $this->view->show($page, $data, $this->bladeService);
    }

    /**
     * @param array<string, mixed> $data
     * @param string $page
     *
     * @return void
     */
    private function appendComponentsOverviewPageData(array &$data, string $page): void
    {
        if ($page !== 'components') {
            return;
        }

        $componentConfigPaths = glob(BASEPATH . 'source/components/*/component.json') ?: [];
        $componentOverviewItems = [];

        foreach ($componentConfigPaths as $componentConfigPath) {
            $configContent = file_get_contents($componentConfigPath);
            $config = is_string($configContent) ? json_decode($configContent, true) : null;
            if (!is_array($config)) {
                continue;
            }

            $slug = isset($config['slug']) ? strtolower((string) $config['slug']) : '';
            $name = isset($config['name']) ? (string) $config['name'] : '';

            if ($slug === '' || $name === '') {
                continue;
            }

            $componentOverviewItems[] = [
                'slug' => $slug,
                'name' => $name,
                'description' => isset($config['description']) && is_string($config['description']) ? $config['description'] : '',
                'icon' => isset($config['icon']) && is_string($config['icon']) && $config['icon'] !== '' ? $config['icon'] : 'widgets',
                'href' => '/components/' . $slug,
            ];
        }

        usort(
            $componentOverviewItems,
            static fn(array $left, array $right): int => strcmp((string) ($left['name'] ?? ''), (string) ($right['name'] ?? '')),
        );

        $data['componentOverviewItems'] = $componentOverviewItems;
    }

    /**
     * @param array<string, mixed> $data
     * @param string $page
     *
     * @return void
     */
    private function appendComponentPageData(array &$data, string $page): void
    {
        if ($page !== 'component') {
            return;
        }

        $path = trim($this->request->getPath(), '/');
        $segments = array_values(array_filter(explode('/', $path), static fn(string $segment): bool => $segment !== ''));

        $slug = $segments[1] ?? '';
        if ($slug === '') {
            return;
        }

        $headline = ucfirst($slug);
        $componentIcon = 'widgets';
        $description = '';
        $similarComponents = [];
        $componentConfigPath = BASEPATH . 'source/components/' . $slug . '/component.json';
        if (is_file($componentConfigPath)) {
            $configContent = file_get_contents($componentConfigPath);
            $config = is_string($configContent) ? json_decode($configContent, true) : null;
            if (is_array($config)) {
                if (isset($config['name']) && is_string($config['name']) && $config['name'] !== '') {
                    $headline = $config['name'];
                }

                if (isset($config['description']) && is_string($config['description'])) {
                    $description = $config['description'];
                }

                if (isset($config['icon']) && is_string($config['icon']) && $config['icon'] !== '') {
                    $componentIcon = $config['icon'];
                }

                if (isset($config['similarComponents']) && is_array($config['similarComponents'])) {
                    $similarComponents = array_values(array_filter($config['similarComponents'], static fn($item): bool => is_string($item) && $item !== ''));
                }
            }
        }

        $similarComponentItems = [];
        foreach ($similarComponents as $similarSlug) {
            $similarName = ucfirst($similarSlug);
            $similarIcon = 'widgets';
            $similarComponentConfigPath = BASEPATH . 'source/components/' . $similarSlug . '/component.json';

            if (is_file($similarComponentConfigPath)) {
                $similarConfigContent = file_get_contents($similarComponentConfigPath);
                $similarConfig = is_string($similarConfigContent) ? json_decode($similarConfigContent, true) : null;
                if (is_array($similarConfig)) {
                    if (isset($similarConfig['name']) && is_string($similarConfig['name']) && $similarConfig['name'] !== '') {
                        $similarName = $similarConfig['name'];
                    }

                    if (isset($similarConfig['icon']) && is_string($similarConfig['icon']) && $similarConfig['icon'] !== '') {
                        $similarIcon = $similarConfig['icon'];
                    }
                }
            }

            $similarComponentItems[] = [
                'slug' => $similarSlug,
                'name' => $similarName,
                'icon' => $similarIcon,
                'href' => '/components/' . $similarSlug,
            ];
        }

        $data['slug'] = $slug;
        $data['headline'] = $headline;
        $data['componentIcon'] = $componentIcon;
        $data['description'] = $description;
        $data['similarComponentItems'] = $similarComponentItems;
        $data['pageNow'] = 'components/' . $slug;
    }

    /**
     * @param array<string, mixed> $data
     * @param string $page
     *
     * @return void
     */
    private function appendUtilitiesOverviewPageData(array &$data, string $page): void
    {
        if ($page !== 'utilities') {
            return;
        }

        $utilityConfigPaths = glob(BASEPATH . 'source/utilities/*/utility.json') ?: [];
        $utilitiesOverviewItems = [];

        foreach ($utilityConfigPaths as $utilityConfigPath) {
            $configContent = file_get_contents($utilityConfigPath);
            $config = is_string($configContent) ? json_decode($configContent, true) : null;
            if (!is_array($config)) {
                continue;
            }

            $slug = isset($config['slug']) ? strtolower((string) $config['slug']) : '';
            $name = isset($config['name']) ? (string) $config['name'] : '';

            if ($slug === '' || $name === '') {
                continue;
            }

            $utilitiesOverviewItems[] = [
                'slug' => $slug,
                'name' => $name,
                'description' => $this->resolveUtilityOverviewDescription($config),
                'href' => '/utilities/' . $slug,
                'icon' => isset($config['icon']) && is_string($config['icon']) && $config['icon'] !== '' ? $config['icon'] : 'tune',
            ];
        }

        usort(
            $utilitiesOverviewItems,
            static fn(array $left, array $right): int => strcmp((string) ($left['name'] ?? ''), (string) ($right['name'] ?? '')),
        );

        $data['utilitiesOverviewItems'] = $utilitiesOverviewItems;
    }

    /**
     * @param array<string, mixed> $config
     *
     * @return string
     */
    private function resolveUtilityOverviewDescription(array $config): string
    {
        $entries = $config['entries'] ?? null;
        if (!is_array($entries)) {
            return '';
        }

        foreach ($entries as $entry) {
            if (!is_array($entry)) {
                continue;
            }

            $summary = $entry['summary'] ?? null;
            if (is_array($summary) && !empty($summary) && is_string($summary[0])) {
                return $summary[0];
            }

            $description = $entry['description'] ?? null;
            if (!is_array($description) || empty($description)) {
                continue;
            }

            foreach ($description as $value) {
                if (is_string($value) && $value !== '') {
                    return $value;
                }
            }
        }

        return '';
    }

    /**
     * @param array<string, mixed> $data
     * @param string $page
     *
     * @return void
     */
    private function appendSearchPageData(array &$data, string $page): void
    {
        if ($page !== 'search') {
            return;
        }

        $query = trim((string) ($this->request->getQuery('s') ?? ''));
        $searchResponse = $this->search->search($query, 30);

        $componentResults = $searchResponse['results']['components'] ?? [];
        if (!is_array($componentResults)) {
            $componentResults = [];
        }

        $data['searchQuery'] = $query;
        $data['searchResults'] = $searchResponse['results'] ?? [];
        $data['componentSearchResults'] = $componentResults;
        $data['searchTotal'] = count($componentResults);
        $data['pageNow'] = 'search';
    }
}
