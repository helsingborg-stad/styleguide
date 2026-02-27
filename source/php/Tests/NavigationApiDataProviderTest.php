<?php

namespace HbgStyleGuide\Tests;

use HbgStyleGuide\Data\JsonDataLoader;
use HbgStyleGuide\Data\NavigationApiDataProvider;
use PHPUnit\Framework\TestCase;

/**
 * @covers \HbgStyleGuide\Data\NavigationApiDataProvider
 */
class NavigationApiDataProviderTest extends TestCase
{
    /**
     * @var string
     */
    private string $tempProjectRoot;

    /**
     * @return void
     */
    protected function setUp(): void
    {
        $this->tempProjectRoot = sys_get_temp_dir() . '/styleguide-nav-provider-' . uniqid('', true);
        mkdir($this->tempProjectRoot . '/assets/data', 0777, true);

        file_put_contents(
            $this->tempProjectRoot . '/assets/data/topnav.json',
            json_encode([
                'pages' => [
                    '1' => [
                        'title' => 'About',
                        'href' => '#1',
                        'items' => [],
                    ],
                ],
            ]),
        );

        file_put_contents(
            $this->tempProjectRoot . '/assets/data/sidebar-children.json',
            json_encode([
                'children' => [
                    'default' => [['id' => 1, 'label' => 'Default child', 'href' => '#', 'children' => false]],
                    '20' => [['id' => 20, 'label' => 'Specific child', 'href' => '#', 'children' => false]],
                ],
            ]),
        );
    }

    /**
     * @return void
     */
    protected function tearDown(): void
    {
        @unlink($this->tempProjectRoot . '/assets/data/topnav.json');
        @unlink($this->tempProjectRoot . '/assets/data/sidebar-children.json');
        @rmdir($this->tempProjectRoot . '/assets/data');
        @rmdir($this->tempProjectRoot . '/assets');
        @rmdir($this->tempProjectRoot);
    }

    /**
     * @return void
     */
    public function testGetTopNavPageReturnsPageWhenAvailable(): void
    {
        $provider = new NavigationApiDataProvider(new JsonDataLoader($this->tempProjectRoot));

        $result = $provider->getTopNavPage('1');

        $this->assertIsArray($result);
        $this->assertSame('About', $result['title']);
    }

    /**
     * @return void
     */
    public function testGetTopNavPageReturnsNullWhenMissing(): void
    {
        $provider = new NavigationApiDataProvider(new JsonDataLoader($this->tempProjectRoot));

        $result = $provider->getTopNavPage('999');

        $this->assertNull($result);
    }

    /**
     * @return void
     */
    public function testGetSidebarChildrenFallsBackToDefault(): void
    {
        $provider = new NavigationApiDataProvider(new JsonDataLoader($this->tempProjectRoot));

        $result = $provider->getSidebarChildren('404');

        $this->assertCount(1, $result);
        $this->assertSame('Default child', $result[0]['label']);
    }
}
