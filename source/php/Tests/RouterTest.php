<?php

namespace MunicipioStyleGuide\Tests;

use MunicipioStyleGuide\Controllers\ApiController;
use MunicipioStyleGuide\Controllers\ComponentPageController;
use MunicipioStyleGuide\Controllers\ObjectPageController;
use MunicipioStyleGuide\Controllers\PageController;
use MunicipioStyleGuide\Controllers\ScriptPageController;
use MunicipioStyleGuide\Controllers\UtilityPageController;
use MunicipioStyleGuide\Http\Request;
use MunicipioStyleGuide\Router;
use PHPUnit\Framework\TestCase;

/**
 * @covers \MunicipioStyleGuide\Router
 */
class RouterTest extends TestCase
{
    /**
     * @return void
     */
    public function testDispatchUsesApiControllerForApiRequest(): void
    {
        $request = new Request('/search', []);

        $pageController = $this->createMock(PageController::class);
        $componentPageController = $this->createMock(ComponentPageController::class);
        $objectPageController = $this->createMock(ObjectPageController::class);
        $scriptPageController = $this->createMock(ScriptPageController::class);
        $utilityPageController = $this->createMock(UtilityPageController::class);

        $apiController = $this->createMock(ApiController::class);
        $apiController->expects($this->once())->method('handle');
        $apiController->method('isTopNavRequest')->willReturn(false);
        $apiController->method('isSidebarChildrenRequest')->willReturn(false);

        $pageController->expects($this->never())->method('handle');
        $componentPageController->expects($this->never())->method('handle');
        $objectPageController->expects($this->never())->method('handle');
        $scriptPageController->expects($this->never())->method('handle');
        $utilityPageController->expects($this->never())->method('handle');

        $router = new Router(
            $request,
            $pageController,
            $componentPageController,
            $objectPageController,
            $scriptPageController,
            $utilityPageController,
            $apiController,
        );

        $router->dispatch();
    }

    /**
     * @return void
     */
    public function testDispatchUsesObjectAndScriptControllersForTheirEndpoints(): void
    {
        $objectRequest = new Request('/objects/layout-grid', []);
        $scriptRequest = new Request('/script/data/filter-list', []);

        $pageController = $this->createMock(PageController::class);
        $componentPageController = $this->createMock(ComponentPageController::class);
        $objectPageController = $this->createMock(ObjectPageController::class);
        $scriptPageController = $this->createMock(ScriptPageController::class);
        $utilityPageController = $this->createMock(UtilityPageController::class);
        $apiController = $this->createMock(ApiController::class);

        $apiController->method('isTopNavRequest')->willReturn(false);
        $apiController->method('isSidebarChildrenRequest')->willReturn(false);

        $objectPageController->expects($this->once())->method('handle');
        $scriptPageController->expects($this->once())->method('handle');

        $pageController->expects($this->never())->method('handle');
        $componentPageController->expects($this->never())->method('handle');
        $utilityPageController->expects($this->never())->method('handle');

        $objectRouter = new Router(
            $objectRequest,
            $pageController,
            $componentPageController,
            $objectPageController,
            $scriptPageController,
            $utilityPageController,
            $apiController,
        );

        $scriptRouter = new Router(
            $scriptRequest,
            $pageController,
            $componentPageController,
            $objectPageController,
            $scriptPageController,
            $utilityPageController,
            $apiController,
        );

        $objectRouter->dispatch();
        $scriptRouter->dispatch();
    }

    /**
     * @return void
     *
     * @runInSeparateProcess
     */
    public function testDispatchUsesComponentAndUtilityControllersForDetailPages(): void
    {
        $componentSlug = 'button-' . uniqid('', false);
        $utilitySlug = 'spacing-' . uniqid('', false);

        $createdBasePath = !defined('BASEPATH');
        $tempBasePath = $createdBasePath ? sys_get_temp_dir() . '/styleguide-router-' . uniqid('', true) . '/' : rtrim((string) BASEPATH, '/') . '/';
        mkdir($tempBasePath . 'source/components/' . $componentSlug, 0777, true);
        mkdir($tempBasePath . 'source/utilities/' . $utilitySlug, 0777, true);

        file_put_contents(
            $tempBasePath . 'source/components/' . $componentSlug . '/component.json',
            json_encode(['name' => 'Button', 'slug' => $componentSlug]),
        );

        file_put_contents(
            $tempBasePath . 'source/utilities/' . $utilitySlug . '/utility.json',
            json_encode([
                'apiVersion' => 1,
                'name' => 'Spacing',
                'slug' => $utilitySlug,
                'entries' => [
                    $utilitySlug => [
                        'description' => [
                            'padding' => 'Spacing utility',
                        ],
                    ],
                ],
            ]),
        );

        if ($createdBasePath) {
            define('BASEPATH', $tempBasePath);
        }

        $componentRequest = new Request('/components/' . $componentSlug, []);
        $utilityRequest = new Request('/utilities/' . $utilitySlug, []);

        $pageController = $this->createMock(PageController::class);
        $componentPageController = $this->createMock(ComponentPageController::class);
        $objectPageController = $this->createMock(ObjectPageController::class);
        $scriptPageController = $this->createMock(ScriptPageController::class);
        $utilityPageController = $this->createMock(UtilityPageController::class);
        $apiController = $this->createMock(ApiController::class);

        $apiController->method('isTopNavRequest')->willReturn(false);
        $apiController->method('isSidebarChildrenRequest')->willReturn(false);

        $componentPageController->expects($this->once())->method('handle');
        $utilityPageController->expects($this->once())->method('handle');

        $componentRouter = new Router(
            $componentRequest,
            $pageController,
            $componentPageController,
            $objectPageController,
            $scriptPageController,
            $utilityPageController,
            $apiController,
        );

        $utilityRouter = new Router(
            $utilityRequest,
            $pageController,
            $componentPageController,
            $objectPageController,
            $scriptPageController,
            $utilityPageController,
            $apiController,
        );

        $componentRouter->dispatch();
        $utilityRouter->dispatch();

        @unlink($tempBasePath . 'source/components/' . $componentSlug . '/component.json');
        @unlink($tempBasePath . 'source/utilities/' . $utilitySlug . '/utility.json');
        @rmdir($tempBasePath . 'source/components/' . $componentSlug);
        @rmdir($tempBasePath . 'source/utilities/' . $utilitySlug);

        if ($createdBasePath) {
            @rmdir($tempBasePath . 'source/components');
            @rmdir($tempBasePath . 'source/utilities');
            @rmdir($tempBasePath . 'source');
            @rmdir($tempBasePath);
        }
    }

    /**
     * @return void
     */
    public function testDispatchUsesPageControllerForStandardPages(): void
    {
        $request = new Request('/about', []);

        $pageController = $this->createMock(PageController::class);
        $componentPageController = $this->createMock(ComponentPageController::class);
        $objectPageController = $this->createMock(ObjectPageController::class);
        $scriptPageController = $this->createMock(ScriptPageController::class);
        $utilityPageController = $this->createMock(UtilityPageController::class);
        $apiController = $this->createMock(ApiController::class);

        $apiController->method('isTopNavRequest')->willReturn(false);
        $apiController->method('isSidebarChildrenRequest')->willReturn(false);

        $pageController->expects($this->once())->method('handle');
        $componentPageController->expects($this->never())->method('handle');
        $objectPageController->expects($this->never())->method('handle');
        $scriptPageController->expects($this->never())->method('handle');
        $utilityPageController->expects($this->never())->method('handle');

        $router = new Router(
            $request,
            $pageController,
            $componentPageController,
            $objectPageController,
            $scriptPageController,
            $utilityPageController,
            $apiController,
        );

        $router->dispatch();
    }
}
