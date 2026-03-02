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
    private string $tempProjectRoot;

    protected function setUp(): void
    {
        $_SERVER['HTTP_HOST'] = 'localhost';
        $_SERVER['REQUEST_URI'] = '/components/button';

        $this->tempProjectRoot = sys_get_temp_dir() . '/styleguide-sidebar-nav-' . uniqid('', true);

        mkdir($this->tempProjectRoot . '/assets/data', 0777, true);
        mkdir($this->tempProjectRoot . '/source/components/alpha', 0777, true);
        mkdir($this->tempProjectRoot . '/source/components/beta', 0777, true);
        mkdir($this->tempProjectRoot . '/views/pages/components/atoms', 0777, true);
        mkdir($this->tempProjectRoot . '/views/pages/components/molecules', 0777, true);
        mkdir($this->tempProjectRoot . '/views/pages/components/organisms', 0777, true);
        mkdir($this->tempProjectRoot . '/views/pages/objects', 0777, true);
        mkdir($this->tempProjectRoot . '/views/pages/script', 0777, true);
        mkdir($this->tempProjectRoot . '/views/pages/script/interaction', 0777, true);
        mkdir($this->tempProjectRoot . '/views/pages/script/data', 0777, true);
        mkdir($this->tempProjectRoot . '/views/pages/utilities', 0777, true);

        file_put_contents(
            $this->tempProjectRoot . '/assets/data/navigation-config.json',
            json_encode([
                'unlisted' => ['.', '..', '.DS_Store', 'layout', '404.blade.php', 'home.blade.php', 'usage', 'about'],
                'icons' => [],
                'externalMenuItems' => [],
            ]),
        );

        file_put_contents(
            $this->tempProjectRoot . '/source/components/alpha/component.json',
            json_encode([
                'name' => 'Alpha Component',
                'slug' => 'alpha',
            ]),
        );

        file_put_contents(
            $this->tempProjectRoot . '/source/components/beta/component.json',
            json_encode([
                'name' => 'Beta Component',
                'slug' => 'beta',
            ]),
        );

        file_put_contents($this->tempProjectRoot . '/views/pages/components/molecules/alpha.blade.php', '');
        file_put_contents($this->tempProjectRoot . '/views/pages/components/organisms/beta.blade.php', '');
        file_put_contents($this->tempProjectRoot . '/views/pages/script/interaction/class-toggle.blade.php', '');
        file_put_contents($this->tempProjectRoot . '/views/pages/script/data/sort.blade.php', '');
    }

    protected function tearDown(): void
    {
        unset($_SERVER['HTTP_HOST'], $_SERVER['REQUEST_URI']);

        @unlink($this->tempProjectRoot . '/assets/data/navigation-config.json');
        @rmdir($this->tempProjectRoot . '/assets/data');
        @rmdir($this->tempProjectRoot . '/assets');

        @unlink($this->tempProjectRoot . '/source/components/alpha/component.json');
        @unlink($this->tempProjectRoot . '/source/components/beta/component.json');
        @rmdir($this->tempProjectRoot . '/source/components/alpha');
        @rmdir($this->tempProjectRoot . '/source/components/beta');
        @rmdir($this->tempProjectRoot . '/source/components');
        @rmdir($this->tempProjectRoot . '/source');

        @unlink($this->tempProjectRoot . '/views/pages/components/molecules/alpha.blade.php');
        @unlink($this->tempProjectRoot . '/views/pages/components/organisms/beta.blade.php');
        @unlink($this->tempProjectRoot . '/views/pages/script/interaction/class-toggle.blade.php');
        @unlink($this->tempProjectRoot . '/views/pages/script/data/sort.blade.php');

        @rmdir($this->tempProjectRoot . '/views/pages/components/atoms');
        @rmdir($this->tempProjectRoot . '/views/pages/components/molecules');
        @rmdir($this->tempProjectRoot . '/views/pages/components/organisms');
        @rmdir($this->tempProjectRoot . '/views/pages/components');
        @rmdir($this->tempProjectRoot . '/views/pages/objects');
        @rmdir($this->tempProjectRoot . '/views/pages/script/interaction');
        @rmdir($this->tempProjectRoot . '/views/pages/script/data');
        @rmdir($this->tempProjectRoot . '/views/pages/script');
        @rmdir($this->tempProjectRoot . '/views/pages/utilities');
        @rmdir($this->tempProjectRoot . '/views/pages');
        @rmdir($this->tempProjectRoot . '/views');

        @rmdir($this->tempProjectRoot);
    }

    public function testBuildSidebarNavigationReturnsMainSectionsInExpectedOrder(): void
    {
        $navigation = new Navigation(
            new Request('/components/molecules/alpha', []),
            new JsonDataLoader($this->tempProjectRoot),
            new NavigationDataParser(),
            $this->tempProjectRoot . '/views/',
            [
                new ComponentsSection(),
                new ObjectsSection(),
                new ScriptSection(),
                new UtilitiesSection(),
            ],
            $this->tempProjectRoot . '/source/components',
        );

        $result = $navigation->buildSidebarNavigation();

        $this->assertSame(['components', 'objects', 'script', 'utilities'], array_keys($result));
        $this->assertSame('//localhost/components/alpha', $result['components']['children']['alpha']['href']);
        $this->assertSame('//localhost/components/beta', $result['components']['children']['beta']['href']);
        $this->assertSame('//localhost/script/interaction/class-toggle', $result['script']['children']['interaction']['children']['class-toggle']['href']);
        $this->assertSame('//localhost/script/data/sort', $result['script']['children']['data']['children']['sort']['href']);
    }
}
