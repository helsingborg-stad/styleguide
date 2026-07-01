<?php

namespace MunicipioStyleGuide\Tests;

use MunicipioStyleGuide\Data\JsonDataLoader;
use MunicipioStyleGuide\Data\NavigationDataParser;
use MunicipioStyleGuide\Http\Request;
use MunicipioStyleGuide\Navigation;
use MunicipioStyleGuide\Sidebar\Sections\ComponentsSection;
use MunicipioStyleGuide\Sidebar\Sections\ConceptsSection;
use MunicipioStyleGuide\Sidebar\Sections\ElementsSection;
use MunicipioStyleGuide\Sidebar\Sections\ObjectsSection;
use MunicipioStyleGuide\Sidebar\Sections\ScriptSection;
use MunicipioStyleGuide\Sidebar\Sections\UtilitiesSection;
use PHPUnit\Framework\TestCase;

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
        mkdir($this->tempProjectRoot . '/source/elements/blockquote', 0777, true);
        mkdir($this->tempProjectRoot . '/source/utilities/alpha-utility', 0777, true);
        mkdir($this->tempProjectRoot . '/source/utilities/beta-utility', 0777, true);
        mkdir($this->tempProjectRoot . '/vendor/helsingborg-stad/component-library/source/php/Component/Alpha__item', 0777, true);
        mkdir($this->tempProjectRoot . '/views/pages/components/atoms', 0777, true);
        mkdir($this->tempProjectRoot . '/views/pages/components/molecules', 0777, true);
        mkdir($this->tempProjectRoot . '/views/pages/components/organisms', 0777, true);
        mkdir($this->tempProjectRoot . '/views/pages/concepts', 0777, true);
        mkdir($this->tempProjectRoot . '/views/pages/objects', 0777, true);
        mkdir($this->tempProjectRoot . '/views/pages/script', 0777, true);
        mkdir($this->tempProjectRoot . '/views/pages/script/interaction', 0777, true);
        mkdir($this->tempProjectRoot . '/views/pages/script/data', 0777, true);
        mkdir($this->tempProjectRoot . '/views/pages/utilities', 0777, true);

        file_put_contents(
            $this->tempProjectRoot . '/assets/data/navigation-config.json',
            json_encode([
                'unlisted' => ['.', '..', '.DS_Store', 'layout', '404.blade.php', 'home.blade.php', 'about'],
                'icons' => [],
                'externalMenuItems' => [],
            ]),
        );

        file_put_contents(
            $this->tempProjectRoot . '/source/components/alpha/component.json',
            json_encode([
                'name' => 'Alpha Component',
                'slug' => 'alpha',
                'state' => 'beta',
            ]),
        );

        file_put_contents(
            $this->tempProjectRoot . '/source/components/beta/component.json',
            json_encode([
                'name' => 'Beta Component',
                'slug' => 'beta',
            ]),
        );

        file_put_contents(
            $this->tempProjectRoot . '/vendor/helsingborg-stad/component-library/source/php/Component/Alpha__item/alpha__item.json',
            json_encode([
                'slug' => 'alpha__item',
                'default' => [
                    'slot' => '',
                ],
                'description' => [
                    'slot' => 'Alpha child item.',
                ],
                'types' => [
                    'slot' => 'string',
                ],
            ]),
        );

        file_put_contents(
            $this->tempProjectRoot . '/source/elements/blockquote/element.json',
            json_encode([
                'name' => 'Blockquote',
                'slug' => 'blockquote',
            ]),
        );

        file_put_contents(
            $this->tempProjectRoot . '/source/utilities/alpha-utility/utility.json',
            json_encode([
                'apiVersion' => 1,
                'name' => 'Alpha Utility',
                'slug' => 'alpha-utility',
                'icon' => 'tune',
                'state' => 'deprecated',
                'entries' => [
                    'alpha-utility' => [
                        'description' => [
                            'main' => 'Alpha utility description',
                        ],
                    ],
                ],
            ]),
        );

        file_put_contents(
            $this->tempProjectRoot . '/source/utilities/beta-utility/utility.json',
            json_encode([
                'apiVersion' => 1,
                'name' => 'Beta Utility',
                'slug' => 'beta-utility',
                'icon' => 'tune',
                'state' => 'stable',
                'entries' => [
                    'beta-utility' => [
                        'description' => [
                            'main' => 'Beta utility description',
                        ],
                    ],
                ],
            ]),
        );

        file_put_contents($this->tempProjectRoot . '/views/pages/components/molecules/alpha.blade.php', '');
        file_put_contents($this->tempProjectRoot . '/views/pages/components/organisms/beta.blade.php', '');
        file_put_contents($this->tempProjectRoot . '/views/pages/concepts.blade.php', '');
        file_put_contents($this->tempProjectRoot . '/views/pages/concepts/inheritance.blade.php', '');
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
        @unlink($this->tempProjectRoot . '/vendor/helsingborg-stad/component-library/source/php/Component/Alpha__item/alpha__item.json');
        @unlink($this->tempProjectRoot . '/source/elements/blockquote/element.json');
        @unlink($this->tempProjectRoot . '/source/utilities/alpha-utility/utility.json');
        @unlink($this->tempProjectRoot . '/source/utilities/beta-utility/utility.json');
        @rmdir($this->tempProjectRoot . '/source/components/alpha');
        @rmdir($this->tempProjectRoot . '/source/components/beta');
        @rmdir($this->tempProjectRoot . '/source/elements/blockquote');
        @rmdir($this->tempProjectRoot . '/source/utilities/alpha-utility');
        @rmdir($this->tempProjectRoot . '/source/utilities/beta-utility');
        @rmdir($this->tempProjectRoot . '/source/components');
        @rmdir($this->tempProjectRoot . '/source/elements');
        @rmdir($this->tempProjectRoot . '/source/utilities');
        @rmdir($this->tempProjectRoot . '/source');

        @rmdir($this->tempProjectRoot . '/vendor/helsingborg-stad/component-library/source/php/Component/Alpha__item');
        @rmdir($this->tempProjectRoot . '/vendor/helsingborg-stad/component-library/source/php/Component');
        @rmdir($this->tempProjectRoot . '/vendor/helsingborg-stad/component-library/source/php');
        @rmdir($this->tempProjectRoot . '/vendor/helsingborg-stad/component-library/source');
        @rmdir($this->tempProjectRoot . '/vendor/helsingborg-stad/component-library');
        @rmdir($this->tempProjectRoot . '/vendor/helsingborg-stad');
        @rmdir($this->tempProjectRoot . '/vendor');

        @unlink($this->tempProjectRoot . '/views/pages/components/molecules/alpha.blade.php');
        @unlink($this->tempProjectRoot . '/views/pages/components/organisms/beta.blade.php');
        @unlink($this->tempProjectRoot . '/views/pages/concepts.blade.php');
        @unlink($this->tempProjectRoot . '/views/pages/concepts/inheritance.blade.php');
        @unlink($this->tempProjectRoot . '/views/pages/script/interaction/class-toggle.blade.php');
        @unlink($this->tempProjectRoot . '/views/pages/script/data/sort.blade.php');

        @rmdir($this->tempProjectRoot . '/views/pages/components/atoms');
        @rmdir($this->tempProjectRoot . '/views/pages/components/molecules');
        @rmdir($this->tempProjectRoot . '/views/pages/components/organisms');
        @rmdir($this->tempProjectRoot . '/views/pages/components');
        @rmdir($this->tempProjectRoot . '/views/pages/concepts');
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
                new ConceptsSection(),
                new ComponentsSection(),
                new ElementsSection(),
                new ObjectsSection(),
                new ScriptSection(),
                new UtilitiesSection(),
            ],
            $this->tempProjectRoot . '/source/components',
            $this->tempProjectRoot . '/source/elements',
            $this->tempProjectRoot . '/source/utilities',
        );

        $result = $navigation->buildSidebarNavigation();

        $this->assertSame(['concepts', 'components', 'elements', 'objects', 'script', 'utilities'], array_keys($result));
        $this->assertSame('Concepts', $result['concepts']['label']);
        $this->assertSame('//localhost/concepts/inheritance', $result['concepts']['children']['inheritance']['href']);
        $this->assertSame('Alpha Component (Beta)', $result['components']['children']['alpha']['label']);
        $this->assertSame('Beta Component', $result['components']['children']['beta']['label']);
        $this->assertSame('//localhost/components/alpha', $result['components']['children']['alpha']['href']);
        $this->assertSame('//localhost/components/beta', $result['components']['children']['beta']['href']);
        $this->assertSame('//localhost/components/alpha#subcomponent-alpha-item', $result['components']['children']['alpha']['children']['alpha__item']['href']);
        $this->assertSame('Alpha Item', $result['components']['children']['alpha']['children']['alpha__item']['label']);
        $this->assertFalse($result['components']['children']['beta']['children']);
        $this->assertSame('Blockquote', $result['elements']['children']['blockquote']['label']);
        $this->assertSame('//localhost/elements/blockquote', $result['elements']['children']['blockquote']['href']);
        $this->assertSame('Alpha Utility (Deprecated)', $result['utilities']['children']['alpha-utility']['label']);
        $this->assertSame('Beta Utility', $result['utilities']['children']['beta-utility']['label']);
        $this->assertSame('//localhost/utilities/alpha-utility', $result['utilities']['children']['alpha-utility']['href']);
        $this->assertSame('//localhost/utilities/beta-utility', $result['utilities']['children']['beta-utility']['href']);
        $this->assertSame('//localhost/script/interaction/class-toggle', $result['script']['children']['interaction']['children']['class-toggle']['href']);
        $this->assertSame('//localhost/script/data/sort', $result['script']['children']['data']['children']['sort']['href']);
    }
}
