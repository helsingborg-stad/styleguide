<?php

namespace MunicipioStyleGuide\Tests;

use MunicipioStyleGuide\Http\Request;
use PHPUnit\Framework\TestCase;

/**
 * @covers \MunicipioStyleGuide\Http\Request
 */
class RequestTest extends TestCase
{
    private string $tempBasePath;

    protected function setUp(): void
    {
        $this->tempBasePath = sys_get_temp_dir() . '/styleguide-request-' . uniqid('', true) . '/';

        mkdir($this->tempBasePath . 'source/components/button', 0777, true);
        mkdir($this->tempBasePath . 'source/utilities/spacing', 0777, true);
        mkdir($this->tempBasePath . 'source/utilities/color', 0777, true);
        mkdir($this->tempBasePath . 'source/utilities/border-radius', 0777, true);
        mkdir($this->tempBasePath . 'source/utilities/accessability', 0777, true);

        file_put_contents($this->tempBasePath . 'source/components/button/component.json', '{"name":"Button","slug":"button"}');
        file_put_contents($this->tempBasePath . 'source/utilities/spacing/utility.json', '{"apiVersion":1,"name":"Spacing","slug":"spacing","icon":"space_bar","entries":{"spacing":{"description":{"prop":"Selects spacing"}}}}');
        file_put_contents($this->tempBasePath . 'source/utilities/color/utility.json', '{"apiVersion":1,"name":"Color","slug":"color","icon":"palette","entries":{"colors__text":{"description":{"color":"Text color"}}}}');
        file_put_contents($this->tempBasePath . 'source/utilities/border-radius/utility.json', '{"apiVersion":1,"name":"Border Radius","slug":"border-radius","icon":"rounded_corner","entries":{"radius":{"description":{"radius":"Radius utility"}}}}');
        file_put_contents($this->tempBasePath . 'source/utilities/accessability/utility.json', '{"apiVersion":1,"name":"Accessability","slug":"accessibility","icon":"accessibility_new","entries":{"screen-readers":{"description":{"focus":"Screen reader helper"}}}}');

        if (!defined('BASEPATH')) {
            define('BASEPATH', $this->tempBasePath);
        }
    }

    protected function tearDown(): void
    {
        if (defined('BASEPATH') && rtrim((string) BASEPATH, '/') === rtrim($this->tempBasePath, '/')) {
            return;
        }

        @unlink($this->tempBasePath . 'source/components/button/component.json');
        @unlink($this->tempBasePath . 'source/utilities/spacing/utility.json');
        @unlink($this->tempBasePath . 'source/utilities/color/utility.json');
        @unlink($this->tempBasePath . 'source/utilities/border-radius/utility.json');
        @unlink($this->tempBasePath . 'source/utilities/accessability/utility.json');
        @rmdir($this->tempBasePath . 'source/components/button');
        @rmdir($this->tempBasePath . 'source/utilities/spacing');
        @rmdir($this->tempBasePath . 'source/utilities/color');
        @rmdir($this->tempBasePath . 'source/utilities/border-radius');
        @rmdir($this->tempBasePath . 'source/utilities/accessability');
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

    public function testResolvePageMapsLegacyUtilityPluralSlugToUtilityView(): void
    {
        $request = new Request('/utilities/colors', []);

        $result = $request->resolvePage();

        $this->assertSame('utility', $result);
    }

    public function testResolvePageMapsLegacyUtilityEntrySlugToUtilityView(): void
    {
        $request = new Request('/utilities/radius', []);

        $result = $request->resolvePage();

        $this->assertSame('utility', $result);
    }

    public function testResolvePageMapsLegacyUtilityFolderAliasToUtilityView(): void
    {
        $request = new Request('/utilities/accessability', []);

        $result = $request->resolvePage();

        $this->assertSame('utility', $result);
    }
}
