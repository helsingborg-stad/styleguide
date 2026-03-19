<?php

namespace MunicipioStyleGuide;

use MunicipioStyleGuide\Controllers\ApiController;
use MunicipioStyleGuide\Controllers\ComponentPageController;
use MunicipioStyleGuide\Controllers\ObjectPageController;
use MunicipioStyleGuide\Controllers\PageController;
use MunicipioStyleGuide\Controllers\ScriptPageController;
use MunicipioStyleGuide\Controllers\UtilityPageController;
use MunicipioStyleGuide\Http\Request;

/**
 * Routes incoming request to a page or API controller.
 */
class Router
{
    /**
     * @param Request $request Current request.
     * @param PageController $pageController Page renderer.
     * @param ComponentPageController $componentPageController Component page renderer.
     * @param ObjectPageController $objectPageController Object page renderer.
     * @param ScriptPageController $scriptPageController Script page renderer.
     * @param UtilityPageController $utilityPageController Utility page renderer.
     * @param ApiController $apiController API endpoint handler.
     */
    public function __construct(
        private Request $request,
        private PageController $pageController,
        private ComponentPageController $componentPageController,
        private ObjectPageController $objectPageController,
        private ScriptPageController $scriptPageController,
        private UtilityPageController $utilityPageController,
        private ApiController $apiController,
    ) {}

    /**
     * Dispatches current request.
     *
     * @return void
     */
    public function dispatch(): void
    {
        if ($this->shouldHandleApiRequest()) {
            $this->apiController->handle();
            return;
        }

        $page = $this->request->resolvePage();
        $endpoint = $this->request->getEndpoint();

        if ($page === 'component') {
            $this->componentPageController->handle();
            return;
        }

        if ($page === 'utility') {
            $this->utilityPageController->handle();
            return;
        }

        if ($endpoint === 'objects') {
            $this->objectPageController->handle();
            return;
        }

        if ($endpoint === 'script') {
            $this->scriptPageController->handle();
            return;
        }

        $this->pageController->handle();
    }

    /**
     * Determines if request is API request.
     *
     * @return bool
     */
    private function shouldHandleApiRequest(): bool
    {
        $endpoint = $this->request->getEndpoint();

        return $endpoint === 'topnav'
            || $endpoint === 'search'
            || $this->apiController->isTopNavRequest()
            || $this->apiController->isSidebarChildrenRequest();
    }
}
