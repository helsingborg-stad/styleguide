<?php

declare(strict_types=1);

namespace MunicipioStyleGuide\Tests;

use ComponentLibrary\Assets\PhpAssetEnqueuer;
use MunicipioStyleGuide\Asset;
use PHPUnit\Framework\TestCase;

class UtilityAssetTest extends TestCase
{
    public function testRenderedClassesEnqueueOnlyTheirUtilityBundlesOnce(): void
    {
        $assets = new PhpAssetEnqueuer();
        $assets->registerUtility('display', '/display.css', 1);
        $assets->registerUtility('spacing', '/spacing.css', 2);
        $assets->registerUtility('color', '/color.css', 3);
        $html = '<div class="u-margin--2 u-display--none u-margin--2">'
            . '<span class="u-padding--1">Text</span></div>';
        $map = ['classes' => [
            'u-margin--2' => ['spacing'],
            'u-padding--1' => ['spacing'],
            'u-display--none' => ['display'],
            'u-color--red' => ['color'],
        ]];

        Asset::enqueueUtilitiesFromHtml($html, $assets, $map);

        self::assertSame(1, substr_count($assets->renderStyles(), '/spacing.css'));
        self::assertSame(1, substr_count($assets->renderStyles(), '/display.css'));
        self::assertStringNotContainsString('/color.css', $assets->renderStyles());
    }
}
