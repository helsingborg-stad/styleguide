<?php

namespace HbgStyleGuide\Controllers;

use HbgStyleGuide\Asset;
use HbgStyleGuide\Contracts\ControllerInterface;
use HbgStyleGuide\Navigation;
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
     */
    public function __construct(
        \HbgStyleGuide\Http\Request $request,
        \HbgStyleGuide\Http\Response $response,
        private BladeServiceInterface $bladeService,
        private View $view,
        private Navigation $navigation,
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

        $this->view->show($page, $data, $this->bladeService);
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
        $segments = array_values(array_filter(explode('/', $path), static fn (string $segment): bool => $segment !== ''));

        $slug = $segments[1] ?? '';
        if ($slug === '') {
            return;
        }

        $headline = ucfirst($slug);
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

                if (isset($config['similarComponents']) && is_array($config['similarComponents'])) {
                    $similarComponents = array_values(array_filter($config['similarComponents'], static fn ($item): bool => is_string($item) && $item !== ''));
                }
            }
        }

        $similarComponentItems = [];
        foreach ($similarComponents as $similarSlug) {
            $similarName = ucfirst($similarSlug);
            $similarComponentConfigPath = BASEPATH . 'source/components/' . $similarSlug . '/component.json';

            if (is_file($similarComponentConfigPath)) {
                $similarConfigContent = file_get_contents($similarComponentConfigPath);
                $similarConfig = is_string($similarConfigContent) ? json_decode($similarConfigContent, true) : null;
                if (is_array($similarConfig) && isset($similarConfig['name']) && is_string($similarConfig['name']) && $similarConfig['name'] !== '') {
                    $similarName = $similarConfig['name'];
                }
            }

            $similarComponentItems[] = [
                'slug' => $similarSlug,
                'name' => $similarName,
                'href' => '/components/' . $similarSlug,
            ];
        }

        $data['slug'] = $slug;
        $data['headline'] = $headline;
        $data['description'] = $description;
        $data['similarComponentItems'] = $similarComponentItems;
        $data['pageNow'] = 'components/' . $slug;
    }
}
