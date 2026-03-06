<?php

namespace HbgStyleGuide\Controllers;

/**
 * Controller for utility detail pages.
 */
class UtilityPageController extends PageController
{
    /**
     * Handles utility page rendering.
     *
     * @return void
     */
    public function handle(): void
    {
        $this->renderPage('utility', $this->viewData());
    }

    /**
     * Returns data sent to the utility detail view.
     *
     * @return array<string, mixed>
     */
    public function viewData(): array
    {
        $data = $this->buildBaseViewData('utility');
        $this->appendUtilityPageData($data, 'utility');

        return $data;
    }
}
