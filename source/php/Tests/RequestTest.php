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

        file_put_contents($this->tempBasePath . 'source/components/button/component.json', '{"name":"Button","slug":"button"}');

        if (!defined('BASEPATH')) {
            define('BASEPATH', $this->tempBasePath);
        }
    }

    protected function tearDown(): void
    {
        @unlink($this->tempBasePath . 'source/components/button/component.json');
        @rmdir($this->tempBasePath . 'source/components/button');
        @rmdir($this->tempBasePath . 'source/components');
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
}
