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

        mkdir($this->tempBasePath . 'views/pages/components/atoms', 0777, true);
        mkdir($this->tempBasePath . 'views/pages/components/molecules', 0777, true);
        mkdir($this->tempBasePath . 'views/pages/components/organisms', 0777, true);

        file_put_contents($this->tempBasePath . 'views/pages/components/molecules/button.blade.php', '');

        if (!defined('BASEPATH')) {
            define('BASEPATH', $this->tempBasePath);
        }
    }

    protected function tearDown(): void
    {
        @unlink($this->tempBasePath . 'views/pages/components/molecules/button.blade.php');
        @rmdir($this->tempBasePath . 'views/pages/components/atoms');
        @rmdir($this->tempBasePath . 'views/pages/components/molecules');
        @rmdir($this->tempBasePath . 'views/pages/components/organisms');
        @rmdir($this->tempBasePath . 'views/pages/components');
        @rmdir($this->tempBasePath . 'views/pages');
        @rmdir($this->tempBasePath . 'views');
        @rmdir($this->tempBasePath);
    }

    public function testResolvePageMapsFlatComponentSlugToExistingComponentView(): void
    {
        $request = new Request('/components/button', []);

        $result = $request->resolvePage();

        $this->assertSame('components/molecules/button', $result);
    }

    public function testResolvePageKeepsLegacyAtomicComponentPath(): void
    {
        $request = new Request('/components/atoms/icon', []);

        $result = $request->resolvePage();

        $this->assertSame('components/atoms/icon', $result);
    }
}
