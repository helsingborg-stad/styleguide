<?php

declare(strict_types=1);

namespace HbgStyleGuide\Tests;

use HbgStyleGuide\View;
use PHPUnit\Framework\TestCase;

/**
 * @covers \HbgStyleGuide\View
 */
class ViewTest extends TestCase
{
    /**
     * @var string
     */
    private string $tempComponentLibraryPath;

    /**
     * Prepare isolated component library fixture.
     *
     * @return void
     */
    protected function setUp(): void
    {
        parent::setUp();

        $this->tempComponentLibraryPath = sys_get_temp_dir() . '/styleguide-view-test-' . uniqid('', true);
        mkdir($this->tempComponentLibraryPath . '/source/php/Component/IconSection', 0777, true);
        mkdir($this->tempComponentLibraryPath . '/source/php/Component/AnchorMenu', 0777, true);
    }

    /**
     * Clean up fixture directories.
     *
     * @return void
     */
    protected function tearDown(): void
    {
        @rmdir($this->tempComponentLibraryPath . '/source/php/Component/IconSection');
        @rmdir($this->tempComponentLibraryPath . '/source/php/Component/AnchorMenu');
        @rmdir($this->tempComponentLibraryPath . '/source/php/Component');
        @rmdir($this->tempComponentLibraryPath . '/source/php');
        @rmdir($this->tempComponentLibraryPath . '/source');
        @rmdir($this->tempComponentLibraryPath);

        parent::tearDown();
    }

    /**
     * Ensure lowercase slug resolves to PascalCase component directory.
     *
     * @return void
     */
    public function testResolveComponentConfigPathMatchesPascalCaseComponentDirectoryFromLowercaseSlug(): void
    {
        $view = new View();

        $reflection = new \ReflectionClass($view);
        $method = $reflection->getMethod('resolveComponentConfigPath');
        $method->setAccessible(true);

        $resolvedPath = $method->invoke($view, $this->tempComponentLibraryPath, 'iconsection');

        $this->assertSame(
            $this->tempComponentLibraryPath . '/source/php/Component/IconSection/*.json',
            $resolvedPath,
        );
    }

    /**
     * Ensure lowercase slug resolves to camel-cased component directory.
     *
     * @return void
     */
    public function testResolveComponentConfigPathMatchesCamelCaseComponentDirectoryFromLowercaseSlug(): void
    {
        $view = new View();

        $reflection = new \ReflectionClass($view);
        $method = $reflection->getMethod('resolveComponentConfigPath');
        $method->setAccessible(true);

        $resolvedPath = $method->invoke($view, $this->tempComponentLibraryPath, 'anchormenu');

        $this->assertSame(
            $this->tempComponentLibraryPath . '/source/php/Component/AnchorMenu/*.json',
            $resolvedPath,
        );
    }
}
