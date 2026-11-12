<?php

declare(strict_types=1);

namespace MunicipioStyleGuide\Tests;

use MunicipioStyleGuide\Helper\ImageProvider;
use PHPUnit\Framework\TestCase;

class ImageProviderTest extends TestCase
{
    /**
     * @dataProvider providerUrls
     */
    public function testBuildsProviderSpecificUrls(string $provider, string $expected): void
    {
        static::assertSame($expected, ImageProvider::url(800, 600, 'forest path', $provider));
    }

    public static function providerUrls(): array
    {
        return [
            ['imgipsum', 'https://cdn.imgipsum.com/random/800/600/webp/landscapes'],
            ['image-api', 'https://image.msar.me/unsplash/random?query=nature'],
            ['placebear', 'https://placebear.com/800/600'],
            ['picsum', 'https://picsum.photos/seed/forest%20path/800/600'],
        ];
    }

    public function testUsesImageApiByDefault(): void
    {
        static::assertSame(
            'https://image.msar.me/unsplash/random?query=nature',
            ImageProvider::url(800, 600, 'forest path'),
        );
    }

    public function testReplacesExternalExampleImages(): void
    {
        $markup = '<img src="https://picsum.photos/id/42/800/600"><img src="https://picsum.photos/seed/a%20seed/300/200">';

        static::assertSame(
            '<img src="https://image.msar.me/unsplash/random?query=nature"><img src="https://image.msar.me/unsplash/random?query=nature">',
            ImageProvider::replaceExternalUrls($markup),
        );
    }

    public function testReplacesEveryCurrentExternalImageProvider(): void
    {
        $markup = '<img src="https://i.pravatar.cc/144?img=1"><img src="https://images.unsplash.com/photo-123?w=1000&q=80"><img src="https://upload.wikimedia.org/example.jpg"><img src="https://www.w3schools.com/w3css/img_lights.jpg">';

        static::assertSame(
            '<img src="https://image.msar.me/unsplash/random?query=nature"><img src="https://image.msar.me/unsplash/random?query=nature"><img src="https://image.msar.me/unsplash/random?query=nature"><img src="https://image.msar.me/unsplash/random?query=nature">',
            ImageProvider::replaceExternalUrls($markup),
        );
    }
}
