<?php

namespace MunicipioStyleGuide;

use MunicipioStyleGuide\Controllers\ApiController;
use MunicipioStyleGuide\Controllers\ComponentPageController;
use MunicipioStyleGuide\Controllers\ObjectPageController;
use MunicipioStyleGuide\Controllers\PageController;
use MunicipioStyleGuide\Controllers\ScriptPageController;
use MunicipioStyleGuide\Controllers\UtilityPageController;
use MunicipioStyleGuide\Data\JsonDataLoader;
use MunicipioStyleGuide\Data\NavigationApiDataProvider;
use MunicipioStyleGuide\Data\NavigationDataParser;
use MunicipioStyleGuide\Http\Request;
use MunicipioStyleGuide\Http\Response;
use MunicipioStyleGuide\Search\DataSources\ComponentsDataSource;
use MunicipioStyleGuide\Search\Search;
use MunicipioStyleGuide\Sidebar\Sections\ComponentsSection;
use MunicipioStyleGuide\Sidebar\Sections\ObjectsSection;
use MunicipioStyleGuide\Sidebar\Sections\ScriptSection;
use MunicipioStyleGuide\Sidebar\Sections\UtilitiesSection;
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
