<?php

namespace HbgStyleGuide\Controllers;

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
            $data['examples'] = \HbgStyleGuide\Helper\Documentation::getUsageExamples($data['slug'], $this->bladeService);
        }

        return $data;
    }
}
