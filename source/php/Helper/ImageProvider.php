<?php

declare(strict_types=1);

namespace MunicipioStyleGuide\Helper;

/**
 * Builds placeholder image URLs for style-guide examples.
 *
 * The provider is selected through STYLEGUIDE_IMAGE_PROVIDER in config.php.
 */
final class ImageProvider
{
    private const PROVIDERS = ['imgipsum', 'image-api', 'placebear', 'picsum'];
    private const IMAGE_API_QUERY = 'nature';

    public static function url(int $width, int $height, string $seed = 'styleguide', ?string $provider = null): string
    {
        $provider ??= self::configuredProvider();

        return match ($provider) {
            'imgipsum' => sprintf('https://cdn.imgipsum.com/random/%d/%d/webp/landscapes', $width, $height),
            // The Image API returns 404 for the arbitrary seeds used by examples,
            // so use a known-good query while its random endpoint provides variety.
            'image-api' => 'https://image.msar.me/unsplash/random?' . http_build_query(['query' => self::IMAGE_API_QUERY]),
            'placebear' => sprintf('https://placebear.com/%d/%d', $width, $height),
            'picsum' => sprintf('https://picsum.photos/seed/%s/%d/%d', rawurlencode($seed), $width, $height),
            default => 'https://image.msar.me/unsplash/random?' . http_build_query(['query' => self::IMAGE_API_QUERY]),
        };
    }

    /**
     * Replaces externally hosted example images in rendered markup so every
     * provider-backed example honours the configured provider.
     */
    public static function replaceExternalUrls(string $markup): string
    {
        $markup = preg_replace_callback(
            '#https://(?:fastly\.)?picsum\.photos(?:/id/([^/?]+)|/seed/([^/?]+))?/(\d+)/(\d+)(?:\.[a-z]+)?(?:\?[^\s"\'<]*)?#i',
            static function (array $matches): string {
                $imageId = $matches[1] ?? '';
                $legacySeed = $matches[2] ?? '';
                $seed = match (true) {
                    $imageId !== '' => 'id-' . $imageId,
                    $legacySeed !== '' => rawurldecode($legacySeed),
                    default => 'styleguide',
                };

                return self::url((int) $matches[3], (int) $matches[4], $seed);
            },
            $markup,
        ) ?? $markup;

        $replacements = [
            '#https://i\.pravatar\.cc/(\d+)(?:\?[^\s"\'<]*)?#i' => static fn(array $match): string => self::url((int) $match[1], (int) $match[1], 'avatar'),
            '#https://images\.unsplash\.com/[^\s"\'<]+#i' => static function (array $match): string {
                preg_match('/[?&]w=(\d+)/', $match[0], $widthMatch);
                $width = (int) ($widthMatch[1] ?? 1200);

                return self::url($width, (int) round($width * 2 / 3), 'unsplash');
            },
            '#https://upload\.wikimedia\.org/[^\s"\'<]+#i' => static fn(): string => self::url(400, 400, 'portrait'),
            '#https://www\.w3schools\.com/w3css/img_lights\.jpg#i' => static fn(): string => self::url(1200, 800, 'lights'),
        ];

        foreach ($replacements as $pattern => $replacement) {
            $markup = preg_replace_callback($pattern, $replacement, $markup) ?? $markup;
        }

        return $markup;
    }

    private static function configuredProvider(): string
    {
        $provider = defined('STYLEGUIDE_IMAGE_PROVIDER') ? (string) STYLEGUIDE_IMAGE_PROVIDER : 'image-api';

        return in_array($provider, self::PROVIDERS, true) ? $provider : 'image-api';
    }
}
