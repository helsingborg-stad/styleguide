<?php

namespace MunicipioStyleGuide\Helper;

use ComponentLibrary\Integrations\Image\ImageFocusResolverInterface;
use ComponentLibrary\Integrations\Image\ImageInterface;
use ComponentLibrary\Integrations\Image\ImageResolverInterface;

/**
 * A fake ImageInterface implementation, used to demonstrate the responsive
 * image contract (srcset, container query data, focus point) in style guide
 * examples without depending on a real image resolver.
 */
class MockImage implements ImageInterface
{
    /**
     * @param array<int,array{width:int,height:int}> $sizes Width/height pairs, ordered smallest to largest.
     * @param array{left:string,top:string} $focusPoint
     */
    public function __construct(
        private array $sizes,
        private string $seed = 'styleguide',
        private array $focusPoint = ['left' => '50', 'top' => '50'],
        private ?string $altText = 'A photograph used to demonstrate responsive image loading.',
        private bool $withLqip = false,
        private bool $transparent = false,
    ) {}

    /**
     * A set of candidates spanning common breakpoints, resulting in a srcset and container query data.
     */
    public static function responsive(string $seed = 'styleguide-responsive'): self
    {
        return new self([
            ['width' => 425, 'height' => 177],
            ['width' => 768, 'height' => 320],
            ['width' => 1024, 'height' => 427],
            ['width' => 1440, 'height' => 600],
            ['width' => 1920, 'height' => 800],
        ], $seed);
    }

    /**
     * Same candidates as {@see responsive()}, but with a low quality image placeholder enabled.
     */
    public static function responsiveWithLqip(string $seed = 'styleguide-lqip'): self
    {
        return new self(
            [
                ['width' => 425, 'height' => 177],
                ['width' => 768, 'height' => 320],
                ['width' => 1024, 'height' => 427],
                ['width' => 1440, 'height' => 600],
                ['width' => 1920, 'height' => 800],
            ],
            $seed,
            withLqip: true,
        );
    }

    /**
     * Candidates with an off-center focus point, to verify object-position is applied.
     */
    public static function withFocusPoint(string $seed = 'styleguide-focus'): self
    {
        return new self(
            [
                ['width' => 425, 'height' => 425],
                ['width' => 1024, 'height' => 1024],
                ['width' => 1920, 'height' => 1920],
            ],
            $seed,
            ['left' => '80', 'top' => '15'],
        );
    }

    /**
     * A single candidate, resulting in no srcset and no container query data.
     */
    public static function withoutSrcset(string $seed = 'styleguide-single'): self
    {
        return new self([
            ['width' => 1024, 'height' => 683],
        ], $seed);
    }

    /**
     * Candidates with a transparent background and a low quality placeholder enabled, to demonstrate
     * that a blurred, opaque LQIP does not composite well with images that rely on transparency.
     */
    public static function transparentWithLqip(string $seed = 'styleguide-transparent'): self
    {
        return new self(
            [
                ['width' => 425, 'height' => 177],
                ['width' => 768, 'height' => 320],
                ['width' => 1024, 'height' => 427],
                ['width' => 1440, 'height' => 600],
                ['width' => 1920, 'height' => 800],
            ],
            $seed,
            altText: 'A logo with a transparent background, used to demonstrate low quality image placeholders.',
            withLqip: true,
            transparent: true,
        );
    }

    public function getUrl(): ?string
    {
        $largest = end($this->sizes);

        return $this->urlForSize($largest['width'], $largest['height']);
    }

    public function getLqipUrl(): ?string
    {
        if (!$this->withLqip) {
            return null;
        }

        // Real-world LQIP generation typically encodes the placeholder as JPEG, which
        // has no alpha channel: transparent areas are filled with a solid backing colour.
        if ($this->transparent) {
            return 'https://placehold.co/32x32/2c3e50/2c3e50/jpg';
        }

        return $this->urlForSize(32, 32);
    }

    public function getSrcSet(): ?string
    {
        if (count($this->sizes) < 2) {
            return null;
        }

        $candidates = array_map(
            fn(array $size) => sprintf('%s %dw', $this->urlForSize($size['width'], $size['height']), $size['width']),
            $this->sizes,
        );

        return implode(', ', $candidates);
    }

    public function getFocusPoint(): array
    {
        return $this->focusPoint;
    }

    public function getAltText(): ?string
    {
        return $this->altText;
    }

    public function getContainerQueryData(): array
    {
        $uniqueId = uniqid('mock-image-');
        $totalSizes = count($this->sizes);
        $previousWidth = 0;

        $items = [];
        foreach ($this->sizes as $index => $size) {
            $items[] = [
                'uuid' => $uniqueId . '-' . $size['width'],
                'url' => $this->urlForSize($size['width'], $size['height']),
                'media' => [
                    'landscape' => $this->createMediaQuery($previousWidth, $size['width'], $index !== $totalSizes - 1),
                    'portrait' => $this->createMediaQuery($previousWidth, $size['width'], $index !== $totalSizes - 1),
                ],
                'aspectRatio' => sprintf('%d/%d', $size['width'], $size['height']),
            ];
            $previousWidth = $size['width'];
        }

        return $items;
    }

    private function createMediaQuery(int $previousWidth, int $width, bool $includeMaxWidth): string
    {
        if ($includeMaxWidth) {
            return sprintf('(min-width: %dpx) and (max-width: %dpx)', $previousWidth, $width);
        }

        return sprintf('(min-width: %dpx)', $previousWidth);
    }

    public static function factory(int $imageId, array $imageSize, ImageResolverInterface $resolver, ?ImageFocusResolverInterface $focusResolver = null): ImageInterface
    {
        throw new \RuntimeException(sprintf('%s is a style guide fake and does not support factory(), construct it directly instead.', self::class));
    }

    private function urlForSize(int $width, int $height): string
    {
        if ($this->transparent) {
            return sprintf('https://placehold.co/%dx%d/transparent/2c3e50/png?text=%s', $width, $height, rawurlencode($this->seed));
        }

        return sprintf('https://picsum.photos/seed/%s/%d/%d', rawurlencode($this->seed), $width, $height);
    }
}
