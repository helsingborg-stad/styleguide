<?php

namespace MunicipioStyleGuide\Controllers;

use MunicipioStyleGuide\Contracts\ControllerInterface;
use MunicipioStyleGuide\Data\NavigationApiDataProvider;
use MunicipioStyleGuide\Search\Search;

/**
 * Controller for API responses used by navigation widgets.
 */
class ApiController extends BaseController implements ControllerInterface
{
    /**
     * @param NavigationApiDataProvider $navigationApiDataProvider API data provider.
     * @param Search $search Search service.
     */
    public function __construct(
        \MunicipioStyleGuide\Http\Request $request,
        \MunicipioStyleGuide\Http\Response $response,
        private NavigationApiDataProvider $navigationApiDataProvider,
        private Search $search,
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
        if ($this->isSearchRequest()) {
            $query = $this->request->getQuery('q') ?? $this->request->getQuery('query') ?? '';
            $limit = max(1, (int) ($this->request->getQuery('limit') ?? 10));
            $response = $this->search->search($query, $limit);
            $this->response->json($response);
            return;
        }

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

    /**
     * Determines if current request should return search data.
     *
     * @return bool
     */
    public function isSearchRequest(): bool
    {
        return $this->request->getEndpoint() === 'search';
    }
}
