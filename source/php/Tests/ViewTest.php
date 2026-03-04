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
     * @var string
     */
    private string $tempUtilitiesPath;

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

        $this->tempUtilitiesPath = $this->tempComponentLibraryPath . '/source/utilities';
        mkdir($this->tempUtilitiesPath . '/color/docs', 0777, true);
        mkdir($this->tempUtilitiesPath . '/shadow/docs', 0777, true);
        mkdir($this->tempUtilitiesPath . '/accessability/docs', 0777, true);

        file_put_contents(
            $this->tempUtilitiesPath . '/color/docs/utility.json',
            json_encode([
                'apiVersion' => 1,
                'name' => 'Color',
                'slug' => 'color',
                'entries' => [
                    'common' => [
                        'description' => [
                            'value' => 'Color entry',
                        ],
                    ],
                    'colors__bg' => [
                        'description' => [
                            'value' => 'Background color',
                        ],
                    ],
                ],
            ]),
        );

        file_put_contents(
            $this->tempUtilitiesPath . '/shadow/docs/utility.json',
            json_encode([
                'apiVersion' => 1,
                'name' => 'Shadow',
                'slug' => 'shadow',
                'entries' => [
                    'common' => [
                        'description' => [
                            'value' => 'Shadow entry',
                        ],
                    ],
                ],
            ]),
        );

        file_put_contents(
            $this->tempUtilitiesPath . '/accessability/docs/utility.json',
            json_encode([
                'apiVersion' => 1,
                'name' => 'Accessability',
                'slug' => 'accessibility',
                'entries' => [
                    'screen-readers' => [
                        'description' => [
                            'value' => 'Screen readers entry',
                        ],
                    ],
                ],
            ]),
        );
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

        @unlink($this->tempUtilitiesPath . '/color/docs/utility.json');
        @unlink($this->tempUtilitiesPath . '/shadow/docs/utility.json');
        @unlink($this->tempUtilitiesPath . '/accessability/docs/utility.json');
        @rmdir($this->tempUtilitiesPath . '/color/docs');
        @rmdir($this->tempUtilitiesPath . '/shadow/docs');
        @rmdir($this->tempUtilitiesPath . '/accessability/docs');
        @rmdir($this->tempUtilitiesPath . '/color');
        @rmdir($this->tempUtilitiesPath . '/shadow');
        @rmdir($this->tempUtilitiesPath . '/accessability');
        @rmdir($this->tempUtilitiesPath);

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

    /**
     * Ensure root matching is prioritized for duplicate utility entry keys.
     *
     * @return void
     */
    public function testResolveUtilityDocumentationConfigurationPrioritizesMatchingRoot(): void
    {
        $view = new View();

        $reflection = new \ReflectionClass($view);
        $method = $reflection->getMethod('resolveUtilityDocumentationConfiguration');
        $method->setAccessible(true);

        $utilityPaths = [
            $this->tempUtilitiesPath . '/shadow/docs/utility.json',
            $this->tempUtilitiesPath . '/color/docs/utility.json',
        ];

        $resolved = $method->invoke(
            $view,
            ['type' => 'utility', 'root' => 'colors', 'config' => 'common'],
            $utilityPaths,
        );

        $this->assertSame($this->tempUtilitiesPath . '/color/docs/utility.json', $resolved[0]);
        $this->assertSame('Color entry', $resolved[1]['description']['value'] ?? '');
    }

    /**
     * Ensure fallback search works when root does not match utility folder name.
     *
     * @return void
     */
    public function testResolveUtilityDocumentationConfigurationFallsBackWhenRootDoesNotMatchFolder(): void
    {
        $view = new View();

        $reflection = new \ReflectionClass($view);
        $method = $reflection->getMethod('resolveUtilityDocumentationConfiguration');
        $method->setAccessible(true);

        $utilityPaths = [
            $this->tempUtilitiesPath . '/accessability/docs/utility.json',
        ];

        $resolved = $method->invoke(
            $view,
            ['type' => 'utility', 'root' => 'screen-readers', 'config' => 'screen-readers'],
            $utilityPaths,
        );

        $this->assertSame($this->tempUtilitiesPath . '/accessability/docs/utility.json', $resolved[0]);
        $this->assertSame('Screen readers entry', $resolved[1]['description']['value'] ?? '');
    }
}
