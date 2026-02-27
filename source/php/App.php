<?php

namespace HbgStyleGuide;

use HbgStyleGuide\Controllers\ApiController;
use HbgStyleGuide\Controllers\PageController;
use HbgStyleGuide\Data\JsonDataLoader;
use HbgStyleGuide\Data\NavigationApiDataProvider;
use HbgStyleGuide\Data\NavigationDataParser;
use HbgStyleGuide\Http\Request;
use HbgStyleGuide\Http\Response;
use HelsingborgStad\BladeService\BladeServiceInterface;

/**
 * Application bootstrap and runtime orchestration.
 */
class App
{
    /**
     * @var Router
     */
    private Router $router;

    /**
     * @param BladeServiceInterface $bladeService Blade renderer.
     */
    public function __construct(BladeServiceInterface $bladeService)
    {
        $request = Request::fromGlobals();
        $response = new Response();

        $jsonDataLoader = new JsonDataLoader(BASEPATH);
        $navigationDataParser = new NavigationDataParser();
        $navigation = new Navigation($request, $jsonDataLoader, $navigationDataParser, VIEWS_PATH);
        $view = new View();

        $pageController = new PageController(
            $request,
            $response,
            $bladeService,
            $view,
            $navigation,
        );

        $apiController = new ApiController(
            $request,
            $response,
            new NavigationApiDataProvider($jsonDataLoader),
        );

        $this->router = new Router($request, $pageController, $apiController);
    }

    /**
     * Runs the application request lifecycle.
     */
    public function run(): void
    {
        $this->router->dispatch();
    }
}
