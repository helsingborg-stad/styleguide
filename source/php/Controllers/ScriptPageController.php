<?php

namespace HbgStyleGuide\Controllers;

/**
 * Controller for script documentation pages.
 */
class ScriptPageController extends PageController
{
    /**
     * Handles script page rendering.
     *
     * @return void
     */
    public function handle(): void
    {
        $page = $this->resolveScriptPage();
        $this->renderPage($page, $this->viewData());
    }

    /**
     * Returns data sent to script documentation views.
     *
     * @return array<string, mixed>
     */
    public function viewData(): array
    {
        $page = $this->resolveScriptPage();

        return $this->buildBaseViewData($page);
    }

    /**
     * @return string
     */
    private function resolveScriptPage(): string
    {
        $resolvedPage = $this->request->resolvePage('script');

        if ($resolvedPage === 'script' || str_starts_with($resolvedPage, 'script/')) {
            return $resolvedPage;
        }

        return 'script';
    }
}
