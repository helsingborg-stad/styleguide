<?php

namespace MunicipioStyleGuide\Tests;

use HelsingborgStad\BladeService\BladeServiceInterface;
use Illuminate\Contracts\View\View as BladeView;
use MunicipioStyleGuide\Helper\Documentation;
use PHPUnit\Framework\Attributes\RunInSeparateProcess;
use PHPUnit\Framework\TestCase;

class ComponentLibraryTest extends TestCase
{
    private string $tempBasePath;

    protected function setUp(): void
    {
        $this->tempBasePath = sys_get_temp_dir() . '/styleguide-component-library-' . uniqid('', true) . '/';

        mkdir($this->tempBasePath . 'vendor/helsingborg-stad/component-library/source/php/Component/Card', 0777, true);
        mkdir($this->tempBasePath . 'vendor/helsingborg-stad/component-library/source/php/Component/Card__header', 0777, true);
        mkdir($this->tempBasePath . 'vendor/helsingborg-stad/component-library/source/php/Component/Card__body', 0777, true);
        mkdir($this->tempBasePath . 'vendor/helsingborg-stad/component-library/source/php/Component/Chat__message', 0777, true);
        mkdir($this->tempBasePath . 'vendor/helsingborg-stad/component-library/source/php/Component/Notice', 0777, true);
        mkdir($this->tempBasePath . 'vendor/helsingborg-stad/component-library/source/php/Component/Toast__item', 0777, true);

        file_put_contents(
            $this->tempBasePath . 'vendor/helsingborg-stad/component-library/source/php/Component/Card/card.json',
            json_encode([
                'slug' => 'card',
                'default' => [
                    'heading' => '',
                ],
                'description' => [
                    'heading' => 'Card heading.',
                ],
                'types' => [
                    'heading' => 'string',
                ],
            ]),
        );

        file_put_contents(
            $this->tempBasePath . 'vendor/helsingborg-stad/component-library/source/php/Component/Card__header/card__header.json',
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
            $this->tempBasePath . 'vendor/helsingborg-stad/component-library/source/php/Component/Card__body/card__body.json',
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

        file_put_contents(
            $this->tempBasePath . 'vendor/helsingborg-stad/component-library/source/php/Component/Chat__message/chat__message.json',
            json_encode([
                'slug' => 'chat__message',
                'default' => [
                    'isReply' => false,
                ],
                'types' => [
                    'isReply' => 'boolean',
                ],
            ]),
        );

        file_put_contents(
            $this->tempBasePath . 'vendor/helsingborg-stad/component-library/source/php/Component/Notice/notice.json',
            json_encode([
                'slug' => 'notice',
                'default' => [
                    'type' => 'info',
                    'message' => ['title' => false, 'text' => false],
                    'icon' => false,
                    'stretch' => false,
                    'dismissable' => false,
                    'action' => false,
                ],
                'description' => [
                    'type' => 'Type of notice: success, warning, danger, info.',
                    'message' => 'An array with two parameters: title and text',
                    'icon' => 'The icon according to the @icon component.',
                    'stretch' => 'If true, the notice will stretch to the full width of the viewport.',
                    'dismissable' => 'If not false, the notice will have a close button.',
                    'action' => 'An array with three parameters: label (text), url and position (aside|below).',
                ],
                'types' => [
                    'type' => 'string',
                    'message' => 'array|object',
                    'icon' => 'array',
                    'stretch' => 'boolean',
                    'dismissable' => 'boolean|string',
                    'action' => 'array|boolean',
                ],
                'view' => 'notice.blade.php',
            ]),
        );

        file_put_contents(
            $this->tempBasePath . 'vendor/helsingborg-stad/component-library/source/php/Component/Toast__item/toast__item.json',
            json_encode([
                'slug' => 'toast__item',
                'default' => [],
                'description' => [],
                'types' => [],
                'view' => 'toast__item.blade.php',
            ]),
        );

        file_put_contents(
            $this->tempBasePath . 'vendor/helsingborg-stad/component-library/source/php/Component/Toast__item/toast__item.blade.php',
            "@notice(\$data)\n@endnotice\n",
        );
    }

    protected function tearDown(): void
    {
        @unlink($this->tempBasePath . 'vendor/helsingborg-stad/component-library/source/php/Component/Card/card.json');
        @unlink($this->tempBasePath . 'vendor/helsingborg-stad/component-library/source/php/Component/Card__header/card__header.json');
        @unlink($this->tempBasePath . 'vendor/helsingborg-stad/component-library/source/php/Component/Card__body/card__body.json');
        @unlink($this->tempBasePath . 'vendor/helsingborg-stad/component-library/source/php/Component/Chat__message/chat__message.json');
        @unlink($this->tempBasePath . 'vendor/helsingborg-stad/component-library/source/php/Component/Notice/notice.json');
        @unlink($this->tempBasePath . 'vendor/helsingborg-stad/component-library/source/php/Component/Toast__item/toast__item.json');
        @unlink($this->tempBasePath . 'vendor/helsingborg-stad/component-library/source/php/Component/Toast__item/toast__item.blade.php');
        @rmdir($this->tempBasePath . 'vendor/helsingborg-stad/component-library/source/php/Component/Card');
        @rmdir($this->tempBasePath . 'vendor/helsingborg-stad/component-library/source/php/Component/Card__header');
        @rmdir($this->tempBasePath . 'vendor/helsingborg-stad/component-library/source/php/Component/Card__body');
        @rmdir($this->tempBasePath . 'vendor/helsingborg-stad/component-library/source/php/Component/Chat__message');
        @rmdir($this->tempBasePath . 'vendor/helsingborg-stad/component-library/source/php/Component/Notice');
        @rmdir($this->tempBasePath . 'vendor/helsingborg-stad/component-library/source/php/Component/Toast__item');
        @rmdir($this->tempBasePath . 'vendor/helsingborg-stad/component-library/source/php/Component');
        @rmdir($this->tempBasePath . 'vendor/helsingborg-stad/component-library/source/php');
        @rmdir($this->tempBasePath . 'vendor/helsingborg-stad/component-library/source');
        @rmdir($this->tempBasePath . 'vendor/helsingborg-stad/component-library');
        @rmdir($this->tempBasePath . 'vendor/helsingborg-stad');
        @rmdir($this->tempBasePath . 'vendor');
        @rmdir($this->tempBasePath);
    }

    public function testGetComponentApiReturnsNormalizedRows(): void
    {
        $rows = Documentation::getComponentApi('card', $this->tempBasePath);

        $this->assertCount(1, $rows);
        $this->assertSame('heading', $rows[0]['parameter']);
        $this->assertSame('', $rows[0]['default']);
        $this->assertSame('string', $rows[0]['type']);
        $this->assertSame('Card heading.', $rows[0]['description']);
    }

    public function testGetSubcomponentsReturnsPurposeAnchorAndParameters(): void
    {
        $subcomponents = Documentation::getSubcomponents('card', $this->tempBasePath);

        $this->assertCount(2, $subcomponents);
        $this->assertSame('Card Body', $subcomponents[0]['displayName']);
        $this->assertSame('@card__body()', $subcomponents[0]['directive']);
        $this->assertSame('subcomponent-card-body', $subcomponents[0]['anchor']);
        $this->assertSame('card__body', $subcomponents[0]['slug']);
        $this->assertSame('Content placed in the card body area.', $subcomponents[0]['purpose']);
        $this->assertSame('slot', $subcomponents[0]['parameters'][0]['parameter']);
        $this->assertSame('string', $subcomponents[0]['parameters'][0]['type']);
        $this->assertSame('classList', $subcomponents[0]['parameters'][1]['parameter']);
        $this->assertSame('attributeList', $subcomponents[0]['parameters'][2]['parameter']);
        $this->assertSame('Additional CSS classes added to the wrapping element.', $subcomponents[0]['parameters'][1]['description']);
        $this->assertStringContainsString('@card__body()', $subcomponents[0]['usageExample']);
        $this->assertStringContainsString('Slot content', $subcomponents[0]['usageExample']);
        $this->assertSame('card__header', $subcomponents[1]['slug']);
    }

    public function testGetSubcomponentsFallsBackToGenericPurposeWhenMissingDescription(): void
    {
        $subcomponents = Documentation::getSubcomponents('chat', $this->tempBasePath);

        $this->assertCount(1, $subcomponents);
        $this->assertSame('Subcomponent for the chat component.', $subcomponents[0]['purpose']);
    }

    public function testGetSubcomponentsUsesProxyComponentApiWhenSchemaIsEmpty(): void
    {
        $subcomponents = Documentation::getSubcomponents('toast', $this->tempBasePath);

        $this->assertCount(1, $subcomponents);
        $this->assertSame('toast__item', $subcomponents[0]['slug']);
        $this->assertSame('Toast Item', $subcomponents[0]['displayName']);
        $this->assertSame('type', $subcomponents[0]['parameters'][0]['parameter']);
        $this->assertSame('info', $subcomponents[0]['parameters'][0]['default']);
        $this->assertSame('message', $subcomponents[0]['parameters'][1]['parameter']);
        $this->assertSame('action', $subcomponents[0]['parameters'][5]['parameter']);
        $this->assertSame('classList', $subcomponents[0]['parameters'][6]['parameter']);
        $this->assertSame('attributeList', $subcomponents[0]['parameters'][7]['parameter']);
        $this->assertStringContainsString("'type' => 'info'", $subcomponents[0]['usageExample']);
        $this->assertStringContainsString("'message' => [", $subcomponents[0]['usageExample']);
    }

    #[RunInSeparateProcess]
    public function testGetUsageExamplesMapsPaperWrapperMetadata(): void
    {
        mkdir($this->tempBasePath . 'source/components/accordion/examples', 0777, true);

        file_put_contents(
            $this->tempBasePath . 'source/components/accordion/examples/examples.json',
            json_encode([
                'standalone' => [
                    'heading' => 'Standalone accordion',
                    'includePaper' => false,
                ],
                'wrapped' => [
                    'heading' => 'Wrapped accordion',
                ],
            ]),
        );

        file_put_contents(
            $this->tempBasePath . 'source/components/accordion/examples/standalone.blade.php',
            "@accordion([])\n@endaccordion\n",
        );

        file_put_contents(
            $this->tempBasePath . 'source/components/accordion/examples/wrapped.blade.php',
            "@paper([])\n@endpaper\n",
        );

        define('BASEPATH', $this->tempBasePath);

        $renderedView = $this->createMock(BladeView::class);
        $renderedView->method('render')->willReturn('<div>Rendered example</div>');

        $blade = $this->createMock(BladeServiceInterface::class);
        $blade->method('makeView')->willReturn($renderedView);

        $examples = Documentation::getUsageExamples('accordion', $blade);

        $this->assertCount(2, $examples);
        $this->assertFalse($examples[0]['includePaper']);
        $this->assertTrue($examples[1]['includePaper']);

        @unlink($this->tempBasePath . 'source/components/accordion/examples/examples.json');
        @unlink($this->tempBasePath . 'source/components/accordion/examples/standalone.blade.php');
        @unlink($this->tempBasePath . 'source/components/accordion/examples/wrapped.blade.php');
        @rmdir($this->tempBasePath . 'source/components/accordion/examples');
        @rmdir($this->tempBasePath . 'source/components/accordion');
        @rmdir($this->tempBasePath . 'source/components');
        @rmdir($this->tempBasePath . 'source');
    }
}
