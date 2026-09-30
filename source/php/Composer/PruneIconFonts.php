<?php

declare(strict_types=1);

namespace MunicipioStyleGuide\Composer;

use Composer\Script\Event;

final class PruneIconFonts
{
    public static function run(Event $event): void
    {
        $root = dirname(__DIR__, 3);
        $package = $root . '/vendor/helsingborg-stad/material-design-icons-json-svg-font';
        if (!is_dir($package)) {
            return;
        }

        // The package pruner keeps a variable font for every selected SVG style.
        // The WordPress editor needs only the outlined font.
        foreach (['rounded', 'sharp'] as $style) {
            $font = $package . '/fonts/' . $style . '/material-symbols-variable.woff2';
            if (is_file($font)) {
                unlink($font);
            }
        }
    }
}
