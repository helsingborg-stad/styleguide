<?php

namespace HbgStyleGuide\Controllers;

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

        return $this->buildBaseViewData($page);
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
