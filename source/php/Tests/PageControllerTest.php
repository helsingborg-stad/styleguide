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

    /**
     * @return void
     *
     * @runInSeparateProcess
     */
    public function testHandleAddsUtilitiesOverviewItemsForUtilitiesPage(): void
    {
        $tempBasePath = sys_get_temp_dir() . '/styleguide-page-controller-utilities-' . uniqid('', true) . '/';

        mkdir($tempBasePath . 'source/utilities/spacing', 0777, true);
        mkdir($tempBasePath . 'source/utilities/display', 0777, true);

        file_put_contents(
            $tempBasePath . 'source/utilities/spacing/utility.json',
            json_encode([
                'apiVersion' => 1,
                'name' => 'Spacing',
                'slug' => 'spacing',
                'icon' => 'space_bar',
                'entries' => [
                    'spacing' => [
                        'description' => [
                            'prop' => 'Selects padding or margin',
                        ],
                    ],
                ],
            ]),
        );

        file_put_contents(
            $tempBasePath . 'source/utilities/display/utility.json',
            json_encode([
                'apiVersion' => 1,
                'name' => 'Display',
                'slug' => 'display',
                'icon' => 'view_compact',
                'entries' => [
                    'display' => [
                        'summary' => [
                            'Sets display state.',
                        ],
                        'description' => [
                            'state' => 'Display utility',
                        ],
                    ],
                ],
            ]),
        );

        define('BASEPATH', $tempBasePath);

        $request = new Request('/utilities', []);
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
                'utilities',
                $this->callback(function (array $data): bool {
                    if (!isset($data['utilitiesOverviewItems']) || !is_array($data['utilitiesOverviewItems'])) {
                        return false;
                    }

                    if (count($data['utilitiesOverviewItems']) !== 2) {
                        return false;
                    }

                    $firstItem = $data['utilitiesOverviewItems'][0];
                    $secondItem = $data['utilitiesOverviewItems'][1];

                    return ($firstItem['name'] ?? '') === 'Display'
                        && ($firstItem['href'] ?? '') === '/utilities/display'
                        && ($firstItem['description'] ?? '') === 'Sets display state.'
                        && ($firstItem['icon'] ?? '') === 'view_compact'
                        && ($secondItem['name'] ?? '') === 'Spacing'
                        && ($secondItem['href'] ?? '') === '/utilities/spacing'
                        && ($secondItem['description'] ?? '') === 'Selects padding or margin'
                        && ($secondItem['icon'] ?? '') === 'space_bar';
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

        @unlink($tempBasePath . 'source/utilities/spacing/utility.json');
        @unlink($tempBasePath . 'source/utilities/display/utility.json');
        @rmdir($tempBasePath . 'source/utilities/spacing');
        @rmdir($tempBasePath . 'source/utilities/display');
        @rmdir($tempBasePath . 'source/utilities');
        @rmdir($tempBasePath . 'source');
        @rmdir($tempBasePath);
    }
}
