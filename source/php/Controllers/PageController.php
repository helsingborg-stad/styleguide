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
        protected BladeServiceInterface $bladeService,
        protected View $view,
        protected Navigation $navigation,
        protected Search $search,
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
        $this->renderPage($page, $this->viewData());
    }

    /**
     * Returns data sent to the resolved view.
     *
     * @return array<string, mixed>
     */
    public function viewData(): array
    {
        $page = $this->request->resolvePage();

        return $this->buildViewDataForPage($page);
    }

    /**
     * Builds base view data and augments it for a specific page.
     *
     * @param string $page
     *
     * @return array<string, mixed>
     */
    protected function buildViewDataForPage(string $page): array
    {
        $data = $this->buildBaseViewData($page);

        $this->appendComponentPageData($data, $page);
        $this->appendUtilityPageData($data, $page);
        $this->appendComponentsOverviewPageData($data, $page);
        $this->appendUtilitiesOverviewPageData($data, $page);
        $this->appendSearchPageData($data, $page);

        return $data;
    }

    /**
     * @param string $page
     *
     * @return array<string, mixed>
     */
    protected function buildBaseViewData(string $page): array
    {
        return [
            'assets' => Asset::getAll(),
            'topNavigation' => $this->navigation->buildItems('pages/', [], false),
            'sideNavigation' => $this->navigation->buildSidebarNavigation(),
            'pageNow' => $page,
        ];
    }

    /**
     * @param string $page
     * @param array<string, mixed> $data
     *
     * @return void
     */
    protected function renderPage(string $page, array $data): void
    {
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
    protected function appendComponentPageData(array &$data, string $page): void
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
        $state = null;
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

                if (isset($config['state']) && is_string($config['state']) && trim($config['state']) !== '') {
                    $state = trim($config['state']);
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
        $data['headline'] = $this->appendStateToLabel($headline, $state);
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
    protected function appendUtilityPageData(array &$data, string $page): void
    {
        if ($page !== 'utility') {
            return;
        }

        $path = trim($this->request->getPath(), '/');
        $segments = array_values(array_filter(explode('/', $path), static fn(string $segment): bool => $segment !== ''));
        $requestedSlug = strtolower((string) ($segments[1] ?? ''));

        if ($requestedSlug === '') {
            return;
        }

        $utilityConfigPaths = glob(BASEPATH . 'source/utilities/*/utility.json') ?: [];

        foreach ($utilityConfigPaths as $utilityConfigPath) {
            $configContent = file_get_contents($utilityConfigPath);
            $config = is_string($configContent) ? json_decode($configContent, true) : null;
            if (!is_array($config)) {
                continue;
            }

            $slug = isset($config['slug']) ? strtolower((string) $config['slug']) : '';
            if ($slug === '' || !$this->utilityConfigMatchesRequestedSlug($config, $utilityConfigPath, $requestedSlug)) {
                continue;
            }

            $entries = isset($config['entries']) && is_array($config['entries']) ? $config['entries'] : [];
            $utilityDirectoryPath = dirname($utilityConfigPath);
            $state = isset($config['state']) && is_string($config['state']) && trim($config['state']) !== ''
                ? trim($config['state'])
                : null;

            $data['slug'] = $slug;
            $data['headline'] = $this->appendStateToLabel(isset($config['name']) && is_string($config['name']) && $config['name'] !== ''
                ? $config['name']
                : ucfirst($slug), $state);
            $data['componentIcon'] = isset($config['icon']) && is_string($config['icon']) && $config['icon'] !== ''
                ? $config['icon']
                : 'tune';
            $data['description'] = $this->resolveUtilityOverviewDescription($config);
            $data['utilityEntryKeys'] = array_values(array_filter(array_keys($entries), static fn($key): bool => is_string($key) && $key !== ''));
            $data['utilityExamplesByEntry'] = $this->resolveUtilityExamplesByEntry($utilityDirectoryPath, $data['utilityEntryKeys']);
            $data['pageNow'] = 'utilities/' . $requestedSlug;

            return;
        }
    }

    /**
     * @param array<string, mixed> $config
     * @param string $utilityConfigPath
     * @param string $requestedSlug
     *
     * @return bool
     */
    protected function utilityConfigMatchesRequestedSlug(array $config, string $utilityConfigPath, string $requestedSlug): bool
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
    protected function normalizeIdentifier(string $value): string
    {
        return strtolower((string) preg_replace('/[^a-z0-9]/i', '', $value));
    }

    /**
     * @param string $label
     * @param string|null $state
     *
     * @return string
     */
    protected function appendStateToLabel(string $label, ?string $state): string
    {
        $normalizedState = strtolower(trim((string) $state));
        if ($normalizedState === '' || $normalizedState === 'stable') {
            return $label;
        }

        return sprintf('%s (%s)', $label, ucfirst($normalizedState));
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
    protected function resolveUtilityOverviewDescription(array $config): string
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
     * @param string $utilityDirectoryPath
     * @param array<int, string> $utilityEntryKeys
     *
     * @return array<string, array<int, string|array{view: string, css: array<int, string>, title?: string, description?: string}>>
     */
    protected function resolveUtilityExamplesByEntry(string $utilityDirectoryPath, array $utilityEntryKeys): array
    {
        $examplesConfigPath = rtrim($utilityDirectoryPath, '/') . '/examples/examples.json';
        if (!is_file($examplesConfigPath)) {
            return [];
        }

        $content = file_get_contents($examplesConfigPath);
        $decoded = is_string($content) ? json_decode($content, true) : null;
        if (!is_array($decoded)) {
            return [];
        }

        $utilityFolder = basename($utilityDirectoryPath);
        $viewPrefix = 'source.utilities.' . $utilityFolder . '.examples.';
        $result = [];

        if (array_is_list($decoded)) {
            foreach ($decoded as $index => $exampleDefinition) {
                $entryKey = null;

                if (is_array($exampleDefinition) && isset($exampleDefinition['entry']) && is_string($exampleDefinition['entry']) && trim($exampleDefinition['entry']) !== '') {
                    $entryKey = trim($exampleDefinition['entry']);
                } elseif (isset($utilityEntryKeys[$index]) && is_string($utilityEntryKeys[$index]) && $utilityEntryKeys[$index] !== '') {
                    $entryKey = $utilityEntryKeys[$index];
                }

                if (!is_string($entryKey) || $entryKey === '') {
                    continue;
                }

                $resolvedExample = $this->resolveUtilityExampleDefinition(
                    $exampleDefinition,
                    $utilityFolder,
                    $viewPrefix,
                );

                if ($resolvedExample === null) {
                    continue;
                }

                if (!isset($result[$entryKey]) || !is_array($result[$entryKey])) {
                    $result[$entryKey] = [];
                }

                $hasMetadata = isset($resolvedExample['title']) || isset($resolvedExample['description']);

                if (empty($resolvedExample['css']) && !$hasMetadata) {
                    $result[$entryKey][] = $resolvedExample['view'];
                    continue;
                }

                $result[$entryKey][] = $resolvedExample;
            }

            return $result;
        }

        foreach ($decoded as $entryKey => $exampleKeys) {
            if (!is_string($entryKey) || $entryKey === '') {
                continue;
            }

            if (is_string($exampleKeys) && $exampleKeys !== '') {
                $exampleKeys = [$exampleKeys];
            }

            if (!is_array($exampleKeys)) {
                continue;
            }

            $result[$entryKey] = [];
            foreach ($exampleKeys as $exampleDefinition) {
                $resolvedExample = $this->resolveUtilityExampleDefinition(
                    $exampleDefinition,
                    $utilityFolder,
                    $viewPrefix,
                );

                if ($resolvedExample === null) {
                    continue;
                }

                $hasMetadata = isset($resolvedExample['title']) || isset($resolvedExample['description']);

                if (empty($resolvedExample['css']) && !$hasMetadata) {
                    $result[$entryKey][] = $resolvedExample['view'];
                    continue;
                }

                $result[$entryKey][] = $resolvedExample;
            }
        }

        return $result;
    }

    /**
     * @param mixed $exampleDefinition
     * @param string $utilityFolder
     * @param string $viewPrefix
     *
      * @return array{view: string, css: array<int, string>, title?: string, description?: string}|null
     */
    protected function resolveUtilityExampleDefinition(mixed $exampleDefinition, string $utilityFolder, string $viewPrefix): ?array
    {
        $exampleKey = null;
        $cssDefinitions = [];
          $title = null;
          $description = null;

        if (is_string($exampleDefinition) && $exampleDefinition !== '') {
            $exampleKey = $exampleDefinition;
        } elseif (is_array($exampleDefinition)) {
            $candidateExampleKey = $exampleDefinition['view'] ?? null;
            if (!is_string($candidateExampleKey) || trim($candidateExampleKey) === '') {
                return null;
            }

            $exampleKey = trim($candidateExampleKey);
            $cssDefinitions = $exampleDefinition['css'] ?? [];

            $candidateTitle = $exampleDefinition['title'] ?? null;
            if (is_string($candidateTitle) && trim($candidateTitle) !== '') {
                $title = trim($candidateTitle);
            }

            $candidateDescription = $exampleDefinition['description'] ?? null;
            if (is_string($candidateDescription) && trim($candidateDescription) !== '') {
                $description = trim($candidateDescription);
            }
        }

        if (!is_string($exampleKey) || $exampleKey === '') {
            return null;
        }

        $resolvedExample = [
            'view' => $viewPrefix . $exampleKey,
            'css' => $this->resolveUtilityExampleCssUrls($cssDefinitions, $utilityFolder),
        ];

        if (is_string($title) && $title !== '') {
            $resolvedExample['title'] = $title;
        }

        if (is_string($description) && $description !== '') {
            $resolvedExample['description'] = $description;
        }

        return $resolvedExample;
    }

    /**
     * @param mixed $cssDefinitions
     * @param string $utilityFolder
     *
     * @return array<int, string>
     */
    protected function resolveUtilityExampleCssUrls(mixed $cssDefinitions, string $utilityFolder): array
    {
        if (is_string($cssDefinitions) && $cssDefinitions !== '') {
            $cssDefinitions = [$cssDefinitions];
        }

        if (!is_array($cssDefinitions)) {
            return [];
        }

        $resolvedUrls = [];
        foreach ($cssDefinitions as $cssDefinition) {
            if (!is_string($cssDefinition) || trim($cssDefinition) === '') {
                continue;
            }

            $normalizedCssDefinition = trim($cssDefinition);
            $isExternalUrl = str_starts_with($normalizedCssDefinition, 'http://')
                || str_starts_with($normalizedCssDefinition, 'https://');

            if ($isExternalUrl || str_starts_with($normalizedCssDefinition, '/')) {
                $resolvedUrls[] = $normalizedCssDefinition;
                continue;
            }

            $resolvedUrls[] = '/source/utilities/' . $utilityFolder . '/examples/' . ltrim($normalizedCssDefinition, '/');
        }

        return array_values(array_unique($resolvedUrls));
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
