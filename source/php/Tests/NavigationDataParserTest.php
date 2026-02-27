<?php

namespace HbgStyleGuide\Tests;

use HbgStyleGuide\Data\NavigationDataParser;
use PHPUnit\Framework\TestCase;

/**
 * @covers \HbgStyleGuide\Data\NavigationDataParser
 */
class NavigationDataParserTest extends TestCase
{
    /**
     * @return void
     */
    public function testParseReturnsParsedNavigationTree(): void
    {
        $parser = new NavigationDataParser();

        $items = [
            [
                'id' => 10,
                'name' => 'Parent',
                'href' => '/parent',
                'list' => [
                    [
                        'id' => 11,
                        'name' => 'Child',
                        'href' => '/child',
                    ],
                ],
            ],
        ];

        $result = $parser->parse($items);

        $this->assertCount(1, $result);
        $this->assertSame('Parent', $result[0]['label']);
        $this->assertSame('10', $result[0]['id']);
        $this->assertIsArray($result[0]['children']);
        $this->assertSame('Child', $result[0]['children'][0]['label']);
    }

    /**
     * @return void
     */
    public function testParseSkipsInvalidItemsAndDefaultsHref(): void
    {
        $parser = new NavigationDataParser();

        $items = [
            'invalid-item',
            [
                'name' => 'Valid Item',
            ],
        ];

        $result = $parser->parse($items);

        $this->assertCount(1, $result);
        $this->assertSame('Valid Item', $result[0]['label']);
        $this->assertSame('#', $result[0]['href']);
        $this->assertFalse($result[0]['children']);
    }
}
