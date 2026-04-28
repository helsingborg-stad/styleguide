<?php

namespace MunicipioStyleGuide\Tests;

use HelsingborgStad\BladeService\BladeServiceInterface;
use MunicipioStyleGuide\Controllers\ObjectPageController;
use MunicipioStyleGuide\Http\Request;
use MunicipioStyleGuide\Http\Response;
use MunicipioStyleGuide\Navigation;
use MunicipioStyleGuide\Search\Search;
use MunicipioStyleGuide\View;
use PHPUnit\Framework\TestCase;

/**
 * @covers \MunicipioStyleGuide\Controllers\ObjectPageController
 */
class ObjectPageControllerTest extends TestCase
{
    /**
     * @return void
     *
     * @runInSeparateProcess
     */
    public function testHandleAddsObjectsOverviewItemsForObjectsPage(): void
    {
        $tempBasePath = sys_get_temp_dir() . '/styleguide-object-controller-' . uniqid('', true) . '/';

        mkdir($tempBasePath . 'source/objects/alpha', 0777, true);
        mkdir($tempBasePath . 'source/objects/zeta', 0777, true);

        file_put_contents(
            $tempBasePath . 'source/objects/alpha/object.json',
            json_encode([
                'slug' => 'alpha',
                'name' => 'Alpha',
                'description' => 'Alpha description',
                'icon' => 'grid_view',
            ]),
        );

        file_put_contents(
            $tempBasePath . 'source/objects/zeta/object.json',
            json_encode([
                'slug' => 'zeta',
                'name' => 'Zeta',
                'description' => 'Zeta description',
            ]),
        );

        define('BASEPATH', $tempBasePath);

        $request = new Request('/objects', []);
        $response = new Response();

        $bladeService = $this->createMock(BladeServiceInterface::class);

        $navigation = $this->createMock(Navigation::class);
        $navigation->expects($this->once())
            ->method('buildItems')
            ->with('pages/', [], false)
            ->willReturn([]);
        $navigation->expects($this->once())
            ->method('buildSidebarNavigation')
            ->willReturn([]);

        $search = $this->createMock(Search::class);

        $view = $this->createMock(View::class);
        $view->expects($this->once())
            ->method('show')
            ->with(
                'objects',
                $this->callback(function (array $data): bool {
                    if (!isset($data['objectsOverviewItems']) || !is_array($data['objectsOverviewItems'])) {
                        return false;
                    }

                    if (count($data['objectsOverviewItems']) !== 2) {
                        return false;
                    }

                    $firstItem = $data['objectsOverviewItems'][0];
                    $secondItem = $data['objectsOverviewItems'][1];

                    return ($firstItem['name'] ?? '') === 'Alpha'
                        && ($firstItem['href'] ?? '') === '/objects/alpha'
                        && ($firstItem['icon'] ?? '') === 'grid_view'
                        && ($firstItem['description'] ?? '') === 'Alpha description'
                        && ($secondItem['name'] ?? '') === 'Zeta'
                        && ($secondItem['href'] ?? '') === '/objects/zeta'
                        && ($secondItem['icon'] ?? '') === 'category';
                }),
                $bladeService,
            );

        $controller = new ObjectPageController(
            $request,
            $response,
            $bladeService,
            $view,
            $navigation,
            $search,
        );

        $controller->handle();

        @unlink($tempBasePath . 'source/objects/alpha/object.json');
        @unlink($tempBasePath . 'source/objects/zeta/object.json');
        @rmdir($tempBasePath . 'source/objects/alpha');
        @rmdir($tempBasePath . 'source/objects/zeta');
        @rmdir($tempBasePath . 'source/objects');
        @rmdir($tempBasePath . 'source');
        @rmdir($tempBasePath);
    }

    /**
     * @return void
     *
     * @runInSeparateProcess
     */
    public function testHandleDoesNotAddObjectsOverviewItemsForSubPage(): void
    {
        $tempBasePath = sys_get_temp_dir() . '/styleguide-object-controller-sub-' . uniqid('', true) . '/';

        mkdir($tempBasePath . 'source/objects/grid', 0777, true);

        file_put_contents(
            $tempBasePath . 'source/objects/grid/object.json',
            json_encode([
                'slug' => 'grid',
                'name' => 'Grid',
                'description' => 'Grid description',
                'icon' => 'grid_view',
            ]),
        );

        define('BASEPATH', $tempBasePath);

        $request = new Request('/objects/grid', []);
        $response = new Response();

        $bladeService = $this->createMock(BladeServiceInterface::class);

        $navigation = $this->createMock(Navigation::class);
        $navigation->expects($this->once())
            ->method('buildItems')
            ->with('pages/', [], false)
            ->willReturn([]);
        $navigation->expects($this->once())
            ->method('buildSidebarNavigation')
            ->willReturn([]);

        $search = $this->createMock(Search::class);

        $view = $this->createMock(View::class);
        $view->expects($this->once())
            ->method('show')
            ->with(
                'objects/grid',
                $this->callback(function (array $data): bool {
                    return !isset($data['objectsOverviewItems']);
                }),
                $bladeService,
            );

        $controller = new ObjectPageController(
            $request,
            $response,
            $bladeService,
            $view,
            $navigation,
            $search,
        );

        $controller->handle();

        @unlink($tempBasePath . 'source/objects/grid/object.json');
        @rmdir($tempBasePath . 'source/objects/grid');
        @rmdir($tempBasePath . 'source/objects');
        @rmdir($tempBasePath . 'source');
        @rmdir($tempBasePath);
    }
}
