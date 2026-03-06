<?php

namespace HbgStyleGuide\Tests;

use HbgStyleGuide\Controllers\ApiController;
use HbgStyleGuide\Controllers\ComponentPageController;
use HbgStyleGuide\Controllers\ObjectPageController;
use HbgStyleGuide\Controllers\PageController;
use HbgStyleGuide\Controllers\ScriptPageController;
use HbgStyleGuide\Controllers\UtilityPageController;
use HbgStyleGuide\Http\Request;
use HbgStyleGuide\Router;
use PHPUnit\Framework\TestCase;

/**
 * @covers \HbgStyleGuide\Router
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
        $tempBasePath = sys_get_temp_dir() . '/styleguide-router-' . uniqid('', true) . '/';
        mkdir($tempBasePath . 'source/components/button', 0777, true);
        mkdir($tempBasePath . 'source/utilities/spacing', 0777, true);

        file_put_contents(
            $tempBasePath . 'source/components/button/component.json',
            json_encode(['name' => 'Button', 'slug' => 'button']),
        );

        file_put_contents(
            $tempBasePath . 'source/utilities/spacing/utility.json',
            json_encode([
                'apiVersion' => 1,
                'name' => 'Spacing',
                'slug' => 'spacing',
                'entries' => [
                    'spacing' => [
                        'description' => [
                            'padding' => 'Spacing utility',
                        ],
                    ],
                ],
            ]),
        );

        define('BASEPATH', $tempBasePath);

        $componentRequest = new Request('/components/button', []);
        $utilityRequest = new Request('/utilities/spacing', []);

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

        @unlink($tempBasePath . 'source/components/button/component.json');
        @unlink($tempBasePath . 'source/utilities/spacing/utility.json');
        @rmdir($tempBasePath . 'source/components/button');
        @rmdir($tempBasePath . 'source/utilities/spacing');
        @rmdir($tempBasePath . 'source/components');
        @rmdir($tempBasePath . 'source/utilities');
        @rmdir($tempBasePath . 'source');
        @rmdir($tempBasePath);
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
