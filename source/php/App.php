<?php

namespace HbgStyleGuide;

use HbgStyleGuide\Controllers\ApiController;
use HbgStyleGuide\Controllers\ComponentPageController;
use HbgStyleGuide\Controllers\ObjectPageController;
use HbgStyleGuide\Controllers\PageController;
use HbgStyleGuide\Controllers\ScriptPageController;
use HbgStyleGuide\Controllers\UtilityPageController;
use HbgStyleGuide\Data\JsonDataLoader;
use HbgStyleGuide\Data\NavigationApiDataProvider;
use HbgStyleGuide\Data\NavigationDataParser;
use HbgStyleGuide\Http\Request;
use HbgStyleGuide\Http\Response;
use HbgStyleGuide\Search\DataSources\ComponentsDataSource;
use HbgStyleGuide\Search\Search;
use HbgStyleGuide\Sidebar\Sections\ComponentsSection;
use HbgStyleGuide\Sidebar\Sections\ObjectsSection;
use HbgStyleGuide\Sidebar\Sections\ScriptSection;
use HbgStyleGuide\Sidebar\Sections\UtilitiesSection;
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
        $navigation = new Navigation(
            $request,
            $jsonDataLoader,
            $navigationDataParser,
            VIEWS_PATH,
            [
                new ComponentsSection(),
                new ObjectsSection(),
                new ScriptSection(),
                new UtilitiesSection(),
            ],
            BASEPATH . 'source/components',
        );
        $search = new Search(
            new ComponentsDataSource(BASEPATH . 'source/components'),
        );
        $view = new View();

        $pageController = new PageController(
            $request,
            $response,
            $bladeService,
            $view,
            $navigation,
            $search,
        );

        $componentPageController = new ComponentPageController(
            $request,
            $response,
            $bladeService,
            $view,
            $navigation,
            $search,
        );

        $objectPageController = new ObjectPageController(
            $request,
            $response,
            $bladeService,
            $view,
            $navigation,
            $search,
        );

        $scriptPageController = new ScriptPageController(
            $request,
            $response,
            $bladeService,
            $view,
            $navigation,
            $search,
        );

        $utilityPageController = new UtilityPageController(
            $request,
            $response,
            $bladeService,
            $view,
            $navigation,
            $search,
        );

        $apiController = new ApiController(
            $request,
            $response,
            new NavigationApiDataProvider($jsonDataLoader),
            $search,
        );

        $this->router = new Router(
            $request,
            $pageController,
            $componentPageController,
            $objectPageController,
            $scriptPageController,
            $utilityPageController,
            $apiController,
        );
    }

    /**
     * Runs the application request lifecycle.
     */
    public function run(): void
    {
        $this->router->dispatch();
    }
}
