<?php

namespace MunicipioStyleGuide\Tests;

use HelsingborgStad\BladeService\BladeServiceInterface;
use MunicipioStyleGuide\Controllers\PageController;
use MunicipioStyleGuide\Http\Request;
use MunicipioStyleGuide\Http\Response;
use MunicipioStyleGuide\Navigation;
use MunicipioStyleGuide\Search\Search;
use MunicipioStyleGuide\View;
use PHPUnit\Framework\Attributes\RunInSeparateProcess;
use PHPUnit\Framework\TestCase;

class ComponentPageSubcomponentsTest extends TestCase
{
    #[RunInSeparateProcess]
    public function testHandleAddsComponentSubcomponentsForComponentPage(): void
    {
        $tempBasePath = sys_get_temp_dir() . '/styleguide-page-controller-component-' . uniqid('', true) . '/';

        mkdir($tempBasePath . 'source/components/card', 0777, true);
        mkdir($tempBasePath . 'vendor/helsingborg-stad/component-library/source/php/Component/Card__header', 0777, true);
        mkdir($tempBasePath . 'vendor/helsingborg-stad/component-library/source/php/Component/Card__body', 0777, true);

        file_put_contents(
            $tempBasePath . 'source/components/card/component.json',
            json_encode([
                'slug' => 'card',
                'name' => 'Card',
                'description' => 'Card description',
                'icon' => 'credit_card',
                'similarComponents' => [],
            ]),
        );

        file_put_contents(
            $tempBasePath . 'vendor/helsingborg-stad/component-library/source/php/Component/Card__header/card__header.json',
            json_encode([
                'slug' => 'card__header',
                'default' => [
                    'slot' => '',
                ],
                'description' => [
                    'slot' => 'Content placed in the card header area.',
                ],
                'types' => [
                    'slot' => 'string',
                ],
            ]),
        );

        file_put_contents(
            $tempBasePath . 'vendor/helsingborg-stad/component-library/source/php/Component/Card__body/card__body.json',
            json_encode([
                'slug' => 'card__body',
                'default' => [
                    'slot' => '',
                ],
                'description' => [
                    'slot' => 'Content placed in the card body area.',
                ],
                'types' => [
                    'slot' => 'string',
                ],
            ]),
        );

        define('BASEPATH', $tempBasePath);

        $request = new Request('/components/card', []);
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
                'component',
                $this->callback(function (array $data): bool {
                    $subcomponents = $data['subcomponents'] ?? null;
                    if (!is_array($subcomponents) || count($subcomponents) !== 2) {
                        return false;
                    }

                    return ($data['slug'] ?? '') === 'card'
                        && ($data['headline'] ?? '') === 'Card'
                        && ($data['componentIcon'] ?? '') === 'credit_card'
                        && ($data['description'] ?? '') === 'Card description'
                        && ($data['pageNow'] ?? '') === 'components/card'
                        && ($subcomponents[0]['displayName'] ?? '') === 'Card Body'
                        && ($subcomponents[0]['directive'] ?? '') === '@card__body()'
                        && ($subcomponents[0]['slug'] ?? '') === 'card__body'
                        && ($subcomponents[0]['anchor'] ?? '') === 'subcomponent-card-body'
                        && is_string($subcomponents[0]['usageExample'] ?? null)
                        && ($subcomponents[1]['slug'] ?? '') === 'card__header';
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

        @unlink($tempBasePath . 'source/components/card/component.json');
        @unlink($tempBasePath . 'vendor/helsingborg-stad/component-library/source/php/Component/Card__header/card__header.json');
        @unlink($tempBasePath . 'vendor/helsingborg-stad/component-library/source/php/Component/Card__body/card__body.json');
        @rmdir($tempBasePath . 'source/components/card');
        @rmdir($tempBasePath . 'source/components');
        @rmdir($tempBasePath . 'source');
        @rmdir($tempBasePath . 'vendor/helsingborg-stad/component-library/source/php/Component/Card__header');
        @rmdir($tempBasePath . 'vendor/helsingborg-stad/component-library/source/php/Component/Card__body');
        @rmdir($tempBasePath . 'vendor/helsingborg-stad/component-library/source/php/Component');
        @rmdir($tempBasePath . 'vendor/helsingborg-stad/component-library/source/php');
        @rmdir($tempBasePath . 'vendor/helsingborg-stad/component-library/source');
        @rmdir($tempBasePath . 'vendor/helsingborg-stad/component-library');
        @rmdir($tempBasePath . 'vendor/helsingborg-stad');
        @rmdir($tempBasePath . 'vendor');
        @rmdir($tempBasePath);
    }
}