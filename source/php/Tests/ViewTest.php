<?php

declare(strict_types=1);

namespace MunicipioStyleGuide\Tests;

use MunicipioStyleGuide\View;
use PHPUnit\Framework\TestCase;

/**
 * @covers \MunicipioStyleGuide\View
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
        mkdir($this->tempUtilitiesPath . '/color', 0777, true);
        mkdir($this->tempUtilitiesPath . '/shadow', 0777, true);
        mkdir($this->tempUtilitiesPath . '/accessability', 0777, true);

        file_put_contents(
            $this->tempUtilitiesPath . '/color/utility.json',
            json_encode([
                'apiVersion' => 1,
                'name' => 'Color',
                'slug' => 'color',
                'icon' => 'palette',
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
            $this->tempUtilitiesPath . '/shadow/utility.json',
            json_encode([
                'apiVersion' => 1,
                'name' => 'Shadow',
                'slug' => 'shadow',
                'icon' => 'layers',
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
            $this->tempUtilitiesPath . '/accessability/utility.json',
            json_encode([
                'apiVersion' => 1,
                'name' => 'Accessability',
                'slug' => 'accessibility',
                'icon' => 'accessibility_new',
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

        @unlink($this->tempUtilitiesPath . '/color/utility.json');
        @unlink($this->tempUtilitiesPath . '/shadow/utility.json');
        @unlink($this->tempUtilitiesPath . '/accessability/utility.json');
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
            $this->tempUtilitiesPath . '/shadow/utility.json',
            $this->tempUtilitiesPath . '/color/utility.json',
        ];

        $resolved = $method->invoke(
            $view,
            ['type' => 'utility', 'root' => 'colors', 'config' => 'common'],
            $utilityPaths,
        );

        $this->assertSame($this->tempUtilitiesPath . '/color/utility.json', $resolved[0]);
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
            $this->tempUtilitiesPath . '/accessability/utility.json',
        ];

        $resolved = $method->invoke(
            $view,
            ['type' => 'utility', 'root' => 'screen-readers', 'config' => 'screen-readers'],
            $utilityPaths,
        );

        $this->assertSame($this->tempUtilitiesPath . '/accessability/utility.json', $resolved[0]);
        $this->assertSame('Screen readers entry', $resolved[1]['description']['value'] ?? '');
    }

    /**
     * Ensure metadata-style examples are ignored for doc rendering.
     *
     * @return void
     */
    public function testResolveDocumentationExamplesIgnoresNonRenderableMetadataExamples(): void
    {
        $view = new View();

        $reflection = new \ReflectionClass($view);
        $method = $reflection->getMethod('resolveDocumentationExamples');
        $method->setAccessible(true);

        $resolved = $method->invoke(
            $view,
            ['viewDoc' => ['type' => 'objects']],
            [
                'examples' => [
                    'containerQuery' => [
                        'title' => 'Container Query Support',
                        'description' => 'metadata-only example',
                    ],
                ],
            ],
            $this->createMock(\HelsingborgStad\BladeService\BladeServiceInterface::class),
        );

        $this->assertSame([], $resolved);
    }

    /**
     * Ensure renderable example schema from config is preserved.
     *
     * @return void
     */
    public function testResolveDocumentationExamplesKeepsRenderableExamples(): void
    {
        $view = new View();

        $reflection = new \ReflectionClass($view);
        $method = $reflection->getMethod('resolveDocumentationExamples');
        $method->setAccessible(true);

        $expectedExample = [
            'description' => [
                'heading' => 'Example heading',
            ],
            'component' => 'source.components.button.examples.primary',
            'html' => [
                'code' => '<button>Test</button>',
            ],
            'blade' => [
                'code' => '@button(["text" => "Test"])',
            ],
        ];

        $resolved = $method->invoke(
            $view,
            ['viewDoc' => ['type' => 'objects']],
            [
                'examples' => [
                    $expectedExample,
                ],
            ],
            $this->createMock(\HelsingborgStad\BladeService\BladeServiceInterface::class),
        );

        $this->assertSame([$expectedExample], $resolved);
    }

    /**
     * Ensure metadata section examples are extracted for object docs.
     *
     * @return void
     */
    public function testResolveDocumentationExampleMetadataSectionsMapsMetadataExamples(): void
    {
        $view = new View();

        $reflection = new \ReflectionClass($view);
        $method = $reflection->getMethod('resolveDocumentationExampleMetadataSections');
        $method->setAccessible(true);

        $resolved = $method->invoke(
            $view,
            ['viewDoc' => ['type' => 'objects']],
            [
                'examples' => [
                    'containerQuery' => [
                        'title' => 'Container Query Support',
                        'description' => 'Enable CQ support',
                        'available' => [
                            'o-layout-grid--cq' => [
                                'description' => 'Enables container queries',
                                'responsive' => false,
                                'containerQuery' => false,
                            ],
                        ],
                    ],
                ],
            ],
        );

        $this->assertCount(1, $resolved);
        $this->assertSame('Container Query Support', $resolved[0]['title'] ?? '');
        $this->assertSame('Enable CQ support', $resolved[0]['description'] ?? '');
        $this->assertArrayHasKey('o-layout-grid--cq', $resolved[0]['available'] ?? []);
    }

    /**
     * Ensure component pages do not map metadata section examples.
     *
     * @return void
     */
    public function testResolveDocumentationExampleMetadataSectionsReturnsEmptyForComponentSlug(): void
    {
        $view = new View();

        $reflection = new \ReflectionClass($view);
        $method = $reflection->getMethod('resolveDocumentationExampleMetadataSections');
        $method->setAccessible(true);

        $resolved = $method->invoke(
            $view,
            ['slug' => 'button'],
            [
                'examples' => [
                    'any' => [
                        'title' => 'Should not be returned for components',
                    ],
                ],
            ],
        );

        $this->assertSame([], $resolved);
    }

    /**
     * Ensure script docs are detected from viewDoc metadata.
     *
     * @return void
     */
    public function testIsScriptDocumentationViewReturnsTrueForScriptType(): void
    {
        $view = new View();

        $reflection = new \ReflectionClass($view);
        $method = $reflection->getMethod('isScriptDocumentationView');
        $method->setAccessible(true);

        $resolved = $method->invoke($view, ['viewDoc' => ['type' => 'script']]);

        $this->assertTrue($resolved);
    }

    /**
     * Ensure script docs are not detected for non-script metadata.
     *
     * @return void
     */
    public function testIsScriptDocumentationViewReturnsFalseForNonScriptType(): void
    {
        $view = new View();

        $reflection = new \ReflectionClass($view);
        $method = $reflection->getMethod('isScriptDocumentationView');
        $method->setAccessible(true);

        $resolved = $method->invoke($view, ['viewDoc' => ['type' => 'objects']]);

        $this->assertFalse($resolved);
    }

    /**
     * Ensure parameter table visibility is enabled for script docs.
     *
     * @return void
     */
    public function testShouldShowParametersTableReturnsTrueForScriptDocumentation(): void
    {
        $view = new View();

        $reflection = new \ReflectionClass($view);
        $method = $reflection->getMethod('shouldShowParametersTable');
        $method->setAccessible(true);

        $resolved = $method->invoke($view, ['viewDoc' => ['type' => 'script']]);

        $this->assertTrue($resolved);
    }

    /**
     * Ensure parameter table visibility is enabled for component docs.
     *
     * @return void
     */
    public function testShouldShowParametersTableReturnsTrueForComponentSlug(): void
    {
        $view = new View();

        $reflection = new \ReflectionClass($view);
        $method = $reflection->getMethod('shouldShowParametersTable');
        $method->setAccessible(true);

        $resolved = $method->invoke($view, ['slug' => 'button']);

        $this->assertTrue($resolved);
    }

    /**
     * Ensure parameter table visibility is disabled for docs without component or script metadata.
     *
     * @return void
     */
    public function testShouldShowParametersTableReturnsFalseForNonScriptMetadataWithoutSlug(): void
    {
        $view = new View();

        $reflection = new \ReflectionClass($view);
        $method = $reflection->getMethod('shouldShowParametersTable');
        $method->setAccessible(true);

        $resolved = $method->invoke($view, ['viewDoc' => ['type' => 'objects']]);

        $this->assertFalse($resolved);
    }
}
