<?php

namespace HbgStyleGuide;

use HbgStyleGuide\Controllers\ApiController;
use HbgStyleGuide\Controllers\PageController;
use HbgStyleGuide\Http\Request;

/**
 * Routes incoming request to a page or API controller.
 */
class Router
{
    /**
     * @param Request $request Current request.
     * @param PageController $pageController Page renderer.
     * @param ApiController $apiController API endpoint handler.
     */
    public function __construct(
        private Request $request,
        private PageController $pageController,
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
