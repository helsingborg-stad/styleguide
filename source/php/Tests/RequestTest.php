<?php

namespace HbgStyleGuide\Tests;

use HbgStyleGuide\Http\Request;
use PHPUnit\Framework\TestCase;

/**
 * @covers \HbgStyleGuide\Http\Request
 */
class RequestTest extends TestCase
{
    private string $tempBasePath;

    protected function setUp(): void
    {
        $this->tempBasePath = sys_get_temp_dir() . '/styleguide-request-' . uniqid('', true) . '/';

        mkdir($this->tempBasePath . 'source/components/button', 0777, true);
        mkdir($this->tempBasePath . 'source/utilities/spacing', 0777, true);

        file_put_contents($this->tempBasePath . 'source/components/button/component.json', '{"name":"Button","slug":"button"}');
        file_put_contents($this->tempBasePath . 'source/utilities/spacing/utility.json', '{"apiVersion":1,"name":"Spacing","slug":"spacing","icon":"space_bar","entries":{"spacing":{"description":{"prop":"Selects spacing"}}}}');

        if (!defined('BASEPATH')) {
            define('BASEPATH', $this->tempBasePath);
        }
    }

    protected function tearDown(): void
    {
        @unlink($this->tempBasePath . 'source/components/button/component.json');
        @unlink($this->tempBasePath . 'source/utilities/spacing/utility.json');
        @rmdir($this->tempBasePath . 'source/components/button');
        @rmdir($this->tempBasePath . 'source/utilities/spacing');
        @rmdir($this->tempBasePath . 'source/components');
        @rmdir($this->tempBasePath . 'source/utilities');
        @rmdir($this->tempBasePath . 'source');
        @rmdir($this->tempBasePath);
    }

    public function testResolvePageMapsFlatComponentSlugToExistingComponentView(): void
    {
        $request = new Request('/components/button', []);

        $result = $request->resolvePage();

        $this->assertSame('component', $result);
    }

    public function testResolvePageKeepsLegacyAtomicComponentPath(): void
    {
        $request = new Request('/components/atoms/icon', []);

        $result = $request->resolvePage();

        $this->assertSame('components/atoms/icon', $result);
    }

    public function testResolvePageReturnsSearchWhenSearchQueryExists(): void
    {
        $request = new Request('/', ['s' => 'button']);

        $result = $request->resolvePage();

        $this->assertSame('search', $result);
    }

    public function testResolvePageMapsUtilitySlugToUtilityView(): void
    {
        $request = new Request('/utilities/spacing', []);

        $result = $request->resolvePage();

        $this->assertSame('utility', $result);
    }
}
