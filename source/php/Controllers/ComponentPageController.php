<?php

namespace MunicipioStyleGuide\Controllers;

use MunicipioStyleGuide\Helper\Documentation;

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
            $data['examples']      = Documentation::getUsageExamples($data['slug'], $this->bladeService);
            $data['cssParameters'] = \MunicipioStyleGuide\Helper\ComponentCssParameters::getForComponent($data['slug']);
            $data['api']           = Documentation::getComponentApi($data['slug']);
            $data['subcomponents'] = Documentation::getSubcomponents($data['slug']);
        }

        return $data;
    }
}
