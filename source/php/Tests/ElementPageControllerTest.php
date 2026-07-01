<?php

namespace MunicipioStyleGuide\Tests;

use HelsingborgStad\BladeService\BladeServiceInterface;
use MunicipioStyleGuide\Controllers\ElementPageController;
use MunicipioStyleGuide\Http\Request;
use MunicipioStyleGuide\Http\Response;
use MunicipioStyleGuide\Navigation;
use MunicipioStyleGuide\Search\Search;
use MunicipioStyleGuide\View;
use PHPUnit\Framework\Attributes\RunInSeparateProcess;
use PHPUnit\Framework\TestCase;

class ElementPageControllerTest extends TestCase
{
    #[RunInSeparateProcess]
    public function testHandleAddsElementsOverviewItemsForElementsPage(): void
    {
        $tempBasePath = sys_get_temp_dir() . '/styleguide-element-controller-' . uniqid('', true) . '/';

        mkdir($tempBasePath . 'source/elements/alpha', 0777, true);
        mkdir($tempBasePath . 'source/elements/zeta', 0777, true);

        file_put_contents(
            $tempBasePath . 'source/elements/alpha/element.json',
            json_encode([
                'slug' => 'alpha',
                'name' => 'Alpha',
                'description' => 'Alpha description',
                'icon' => 'html',
            ]),
        );

        file_put_contents(
            $tempBasePath . 'source/elements/zeta/element.json',
            json_encode([
                'slug' => 'zeta',
                'name' => 'Zeta',
                'description' => 'Zeta description',
            ]),
        );

        define('BASEPATH', $tempBasePath);

        $request = new Request('/elements', []);
        $response = new Response();
        $bladeService = $this->createMock(BladeServiceInterface::class);

        $navigation = $this->createMock(Navigation::class);
        $navigation->expects($this->once())->method('buildItems')->with('pages/', [], false)->willReturn([]);
        $navigation->expects($this->once())->method('buildSidebarNavigation')->willReturn([]);

        $search = $this->createMock(Search::class);

        $view = $this->createMock(View::class);
        $view
            ->expects($this->once())
            ->method('show')
            ->with(
                'elements',
                $this->callback(function (array $data): bool {
                    if (!isset($data['elementsOverviewItems']) || !is_array($data['elementsOverviewItems'])) {
                        return false;
                    }

                    if (count($data['elementsOverviewItems']) !== 2) {
                        return false;
                    }

                    $firstItem = $data['elementsOverviewItems'][0];
                    $secondItem = $data['elementsOverviewItems'][1];

                    return ($firstItem['name'] ?? '') === 'Alpha'
                        && ($firstItem['href'] ?? '') === '/elements/alpha'
                        && ($firstItem['icon'] ?? '') === 'html'
                        && ($secondItem['name'] ?? '') === 'Zeta'
                        && ($secondItem['icon'] ?? '') === 'code_blocks';
                }),
                $bladeService,
            );

        $controller = new ElementPageController(
            $request,
            $response,
            $bladeService,
            $view,
            $navigation,
            $search,
        );

        $controller->handle();

        @unlink($tempBasePath . 'source/elements/alpha/element.json');
        @unlink($tempBasePath . 'source/elements/zeta/element.json');
        @rmdir($tempBasePath . 'source/elements/alpha');
        @rmdir($tempBasePath . 'source/elements/zeta');
        @rmdir($tempBasePath . 'source/elements');
        @rmdir($tempBasePath . 'source');
        @rmdir($tempBasePath);
    }

    #[RunInSeparateProcess]
    public function testHandleAddsElementDocumentationDataForDetailPage(): void
    {
        $tempBasePath = sys_get_temp_dir() . '/styleguide-element-controller-detail-' . uniqid('', true) . '/';

        mkdir($tempBasePath . 'source/elements/blockquote', 0777, true);

        file_put_contents(
            $tempBasePath . 'source/elements/blockquote/element.json',
            json_encode([
                'slug' => 'blockquote',
                'name' => 'Blockquote',
                'description' => 'Quoted content with source attribution.',
                'icon' => 'format_quote',
                'documentationConfig' => 'Blockquote',
            ]),
        );

        define('BASEPATH', $tempBasePath);

        $request = new Request('/elements/blockquote', []);
        $response = new Response();
        $bladeService = $this->createMock(BladeServiceInterface::class);

        $navigation = $this->createMock(Navigation::class);
        $navigation->expects($this->once())->method('buildItems')->with('pages/', [], false)->willReturn([]);
        $navigation->expects($this->once())->method('buildSidebarNavigation')->willReturn([]);

        $search = $this->createMock(Search::class);

        $view = $this->createMock(View::class);
        $view
            ->expects($this->once())
            ->method('show')
            ->with(
                'element',
                $this->callback(function (array $data): bool {
                    return ($data['headline'] ?? '') === 'Blockquote'
                        && ($data['componentIcon'] ?? '') === 'format_quote'
                        && ($data['description'] ?? '') === 'Quoted content with source attribution.'
                        && ($data['pageNow'] ?? '') === 'elements/blockquote'
                        && ($data['viewDoc']['type'] ?? '') === 'elements'
                        && ($data['viewDoc']['root'] ?? '') === 'blockquote'
                        && ($data['viewDoc']['config'] ?? '') === 'Blockquote';
                }),
                $bladeService,
            );

        $controller = new ElementPageController(
            $request,
            $response,
            $bladeService,
            $view,
            $navigation,
            $search,
        );

        $controller->handle();

        @unlink($tempBasePath . 'source/elements/blockquote/element.json');
        @rmdir($tempBasePath . 'source/elements/blockquote');
        @rmdir($tempBasePath . 'source/elements');
        @rmdir($tempBasePath . 'source');
        @rmdir($tempBasePath);
    }
}