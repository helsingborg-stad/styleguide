<?php

namespace HbgStyleGuide\Tests;

use HbgStyleGuide\Data\JsonDataLoader;
use HbgStyleGuide\Data\NavigationDataParser;
use HbgStyleGuide\Http\Request;
use HbgStyleGuide\Navigation;
use HbgStyleGuide\Sidebar\Sections\ComponentsSection;
use HbgStyleGuide\Sidebar\Sections\ObjectsSection;
use HbgStyleGuide\Sidebar\Sections\ScriptSection;
use HbgStyleGuide\Sidebar\Sections\UtilitiesSection;
use PHPUnit\Framework\TestCase;

/**
 * @covers \HbgStyleGuide\Navigation
 */
class NavigationSidebarSectionsTest extends TestCase
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
        $_SERVER['HTTP_HOST'] = 'localhost';
        $_SERVER['REQUEST_URI'] = '/script';

        $this->tempProjectRoot = sys_get_temp_dir() . '/styleguide-sidebar-nav-' . uniqid('', true);

        mkdir($this->tempProjectRoot . '/assets/data', 0777, true);
        mkdir($this->tempProjectRoot . '/views/pages/components', 0777, true);
        mkdir($this->tempProjectRoot . '/views/pages/objects', 0777, true);
        mkdir($this->tempProjectRoot . '/views/pages/script', 0777, true);
        mkdir($this->tempProjectRoot . '/views/pages/utilities', 0777, true);

        file_put_contents(
            $this->tempProjectRoot . '/assets/data/navigation-config.json',
            json_encode([
                'unlisted' => ['.', '..', '.DS_Store', 'layout', '404.blade.php', 'home.blade.php', 'usage', 'about'],
                'icons' => [],
                'externalMenuItems' => [],
            ])
        );
    }

    /**
     * @return void
     */
    protected function tearDown(): void
    {
        unset($_SERVER['HTTP_HOST'], $_SERVER['REQUEST_URI']);

        @unlink($this->tempProjectRoot . '/assets/data/navigation-config.json');
        @rmdir($this->tempProjectRoot . '/assets/data');
        @rmdir($this->tempProjectRoot . '/assets');

        @rmdir($this->tempProjectRoot . '/views/pages/components');
        @rmdir($this->tempProjectRoot . '/views/pages/objects');
        @rmdir($this->tempProjectRoot . '/views/pages/script');
        @rmdir($this->tempProjectRoot . '/views/pages/utilities');
        @rmdir($this->tempProjectRoot . '/views/pages');
        @rmdir($this->tempProjectRoot . '/views');

        @rmdir($this->tempProjectRoot);
    }

    /**
     * @return void
     */
    public function testBuildSidebarNavigationReturnsMainSectionsInExpectedOrder(): void
    {
        $navigation = new Navigation(
            new Request('/script', []),
            new JsonDataLoader($this->tempProjectRoot),
            new NavigationDataParser(),
            $this->tempProjectRoot . '/views/',
            [
                new ComponentsSection(),
                new ObjectsSection(),
                new ScriptSection(),
                new UtilitiesSection(),
            ],
        );

        $result = $navigation->buildSidebarNavigation();

        $this->assertSame(['components', 'objects', 'script', 'utilities'], array_keys($result));
        $this->assertSame('Components', $result['components']['label']);
        $this->assertSame('Objects', $result['objects']['label']);
        $this->assertSame('Script', $result['script']['label']);
        $this->assertSame('Utilities', $result['utilities']['label']);
    }
}
