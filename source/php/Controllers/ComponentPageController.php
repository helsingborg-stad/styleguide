<?php

namespace MunicipioStyleGuide\Controllers;

/**
 * Controller for component detail pages.
 */
class ComponentPageController extends PageController
{
    /**
     * Handles component page rendering.
     *
     * @return void
     */
    public function handle(): void
    {
        $this->renderPage('component', $this->viewData());
    }

    /**
     * Returns data sent to the component detail view.
     *
     * @return array<string, mixed>
     */
    public function viewData(): array
    {
        $data = $this->buildBaseViewData('component');
        $this->appendComponentPageData($data, 'component');

        if (isset($data['slug'])) {
            $data['examples']      = \MunicipioStyleGuide\Helper\Documentation::getUsageExamples($data['slug'], $this->bladeService);
            $data['cssParameters'] = \MunicipioStyleGuide\Helper\ComponentCssParameters::getForComponent($data['slug']);
            $data['api']           = $this->loadVendorComponentApi($data['slug']);
        }

        return $data;
    }

    /**
     * Load API parameter rows from the vendor component-library JSON for a given slug.
     *
     * @param string $slug Component slug.
     *
     * @return array<int, array<string, string>>
     */
    private function loadVendorComponentApi(string $slug): array
    {
        $vendorPath     = rtrim(getcwd(), '/') . '/vendor/helsingborg-stad/component-library/source/php/Component';
        $normalizedSlug = strtolower((string) preg_replace('/[^a-z0-9]/i', '', $slug));

        $matchedDir = null;
        foreach (glob($vendorPath . '/*', GLOB_ONLYDIR) ?: [] as $dir) {
            if (strtolower((string) preg_replace('/[^a-z0-9]/i', '', basename($dir))) === $normalizedSlug) {
                $matchedDir = $dir;
                break;
            }
        }

        if ($matchedDir === null) {
            return [];
        }

        $jsonFiles = glob($matchedDir . '/*.json') ?: [];
        if (empty($jsonFiles)) {
            return [];
        }

        $content = file_get_contents($jsonFiles[0]);
        if (!is_string($content)) {
            return [];
        }

        $config = json_decode($content, true);
        if (!is_array($config)) {
            return [];
        }

        $settings     = is_array($config['default'] ?? null) ? $config['default'] : [];
        $descriptions = is_array($config['description'] ?? null) ? $config['description'] : [];

        $rows = [];
        foreach ($settings as $param => $default) {
            $rows[] = [
                'parameter'   => (string) $param,
                'default'     => is_bool($default) ? ($default ? 'true' : 'false') : (is_array($default) ? '[]' : (string) $default),
                'description' => (string) ($descriptions[$param] ?? '-'),
            ];
        }

        return $rows;
    }
}
