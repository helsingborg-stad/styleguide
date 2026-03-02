<?php

namespace HbgStyleGuide\Tests;

use HbgStyleGuide\Controllers\PageController;
use HbgStyleGuide\Http\Request;
use HbgStyleGuide\Http\Response;
use HbgStyleGuide\Navigation;
use HbgStyleGuide\Search\Search;
use HbgStyleGuide\View;
use HelsingborgStad\BladeService\BladeServiceInterface;
use PHPUnit\Framework\TestCase;

/**
 * @covers \HbgStyleGuide\Controllers\PageController
 */
class PageControllerTest extends TestCase
{
    /**
     * @return void
     *
     * @runInSeparateProcess
     */
    public function testHandleAddsComponentOverviewItemsForComponentsPage(): void
    {
        $tempBasePath = sys_get_temp_dir() . '/styleguide-page-controller-' . uniqid('', true) . '/';

        mkdir($tempBasePath . 'source/components/alpha', 0777, true);
        mkdir($tempBasePath . 'source/components/zeta', 0777, true);

        file_put_contents(
            $tempBasePath . 'source/components/alpha/component.json',
            json_encode([
                'slug' => 'alpha',
                'name' => 'Alpha',
                'description' => 'Alpha description',
                'icon' => 'account_circle',
            ]),
        );

        file_put_contents(
            $tempBasePath . 'source/components/zeta/component.json',
            json_encode([
                'slug' => 'zeta',
                'name' => 'Zeta',
                'description' => 'Zeta description',
            ]),
        );

        define('BASEPATH', $tempBasePath);

        $request = new Request('/components', []);
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
                'components',
                $this->callback(function (array $data): bool {
                    if (!isset($data['componentOverviewItems']) || !is_array($data['componentOverviewItems'])) {
                        return false;
                    }

                    if (count($data['componentOverviewItems']) !== 2) {
                        return false;
                    }

                    $firstItem = $data['componentOverviewItems'][0];
                    $secondItem = $data['componentOverviewItems'][1];

                    return ($firstItem['name'] ?? '') === 'Alpha'
                        && ($firstItem['href'] ?? '') === '/components/alpha'
                        && ($firstItem['icon'] ?? '') === 'account_circle'
                        && ($secondItem['name'] ?? '') === 'Zeta'
                        && ($secondItem['href'] ?? '') === '/components/zeta'
                        && ($secondItem['icon'] ?? '') === 'widgets';
                }),
                $bladeService,
            );

        $controller = new PageController(
            $request,
            $response,
            $bladeService,
            $view,
            $navigation,
            $search,
        );

        $controller->handle();

        @unlink($tempBasePath . 'source/components/alpha/component.json');
        @unlink($tempBasePath . 'source/components/zeta/component.json');
        @rmdir($tempBasePath . 'source/components/alpha');
        @rmdir($tempBasePath . 'source/components/zeta');
        @rmdir($tempBasePath . 'source/components');
        @rmdir($tempBasePath . 'source');
        @rmdir($tempBasePath);
    }
}
