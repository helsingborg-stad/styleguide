<?php

namespace HbgStyleGuide\Tests;

use HbgStyleGuide\Search\DataSources\ComponentsDataSource;
use PHPUnit\Framework\TestCase;

/**
 * @covers \HbgStyleGuide\Search\DataSources\ComponentsDataSource
 */
class ComponentsDataSourceTest extends TestCase
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
        $this->tempProjectRoot = sys_get_temp_dir() . '/styleguide-components-search-' . uniqid('', true);

        mkdir($this->tempProjectRoot . '/source/components/button', 0777, true);
        mkdir($this->tempProjectRoot . '/source/components/badge', 0777, true);

        file_put_contents(
            $this->tempProjectRoot . '/source/components/button/component.json',
            json_encode([
                'name' => 'Button',
                'slug' => 'button',
                'description' => 'Clickable call to action.',
                'keywords' => ['action', 'cta'],
            ]),
        );

        file_put_contents(
            $this->tempProjectRoot . '/source/components/badge/component.json',
            json_encode([
                'name' => 'Badge',
                'slug' => 'badge',
                'description' => 'Small status marker.',
                'keywords' => ['status', 'label'],
            ]),
        );
    }

    /**
     * @return void
     */
    protected function tearDown(): void
    {
        @unlink($this->tempProjectRoot . '/source/components/button/component.json');
        @unlink($this->tempProjectRoot . '/source/components/badge/component.json');
        @rmdir($this->tempProjectRoot . '/source/components/button');
        @rmdir($this->tempProjectRoot . '/source/components/badge');
        @rmdir($this->tempProjectRoot . '/source/components');
        @rmdir($this->tempProjectRoot . '/source');
        @rmdir($this->tempProjectRoot);
    }

    /**
     * @return void
     */
    public function testSearchReturnsBestMatchingComponentFirst(): void
    {
        $dataSource = new ComponentsDataSource($this->tempProjectRoot . '/source/components');

        $result = $dataSource->search('but', 10);

        $this->assertNotEmpty($result);
        $this->assertSame('button', $result[0]['slug']);
        $this->assertSame('/components/button', $result[0]['url']);
        $this->assertGreaterThan(0, $result[0]['score']);
    }

    /**
     * @return void
     */
    public function testSearchReturnsEmptyResultWhenNoMatchExists(): void
    {
        $dataSource = new ComponentsDataSource($this->tempProjectRoot . '/source/components');

        $result = $dataSource->search('zzzzzz', 10);

        $this->assertSame([], $result);
    }
}
