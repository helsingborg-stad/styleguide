<?php

namespace HbgStyleGuide\Controllers;

use HbgStyleGuide\Contracts\ControllerInterface;
use HbgStyleGuide\Data\NavigationApiDataProvider;

/**
 * Controller for API responses used by navigation widgets.
 */
class ApiController extends BaseController implements ControllerInterface
{
    /**
     * @param NavigationApiDataProvider $navigationApiDataProvider API data provider.
     */
    public function __construct(
        \HbgStyleGuide\Http\Request $request,
        \HbgStyleGuide\Http\Response $response,
        private NavigationApiDataProvider $navigationApiDataProvider,
    ) {
        parent::__construct($request, $response);
    }

    /**
     * Handles API request when requested by router.
     *
     * @return void
     */
    public function handle(): void
    {
        if ($this->isTopNavRequest()) {
            $pageId = $this->request->getQuery('pageID');
            $response = $this->navigationApiDataProvider->getTopNavPage((string) $pageId);
            $this->response->json($response);
            return;
        }

        if ($this->isSidebarChildrenRequest()) {
            $parentId = $this->request->getQuery('parentID') ?? $this->request->getQuery('pageId');

            $response = $this->navigationApiDataProvider->getSidebarChildren((string) $parentId);
            $this->response->json($response);
            return;
        }

        $this->response->json(null, 404);
    }

    /**
     * Determines if current request should return top nav data.
     *
     * @return bool
     */
    public function isTopNavRequest(): bool
    {
        return $this->request->hasQuery('pageID');
    }

    /**
     * Determines if current request should return sidebar children data.
     *
     * @return bool
     */
    public function isSidebarChildrenRequest(): bool
    {
        return $this->request->hasQuery('parentID') || $this->request->hasQuery('pageId');
    }
}
