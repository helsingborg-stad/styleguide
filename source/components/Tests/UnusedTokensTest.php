<?php

namespace MunicipioStyleGuide\Components\Tests;

use PHPUnit\Framework\TestCase;

class UnusedTokensTest extends TestCase
{
    /**
     * @testdox component utlilize all tokens declared in component.json
     * @dataProvider componentFilesProvider
     */
    public function testComponentUtilizeAllTokens(string $component, string $tokenFile, string $styleFile): void
    {
        $tokens = static::extractTokensFromTokenFile($tokenFile);
        $styleFileContents = file_get_contents($styleFile);
        $missingTokens = [];

        // Check if tokens are used in the component style file
        foreach ($tokens as $token) {
            // Match tokens.use/get(<anything>, '<token>'[, <optional args>])
            $pattern = '/tokens\.(use|get)\s*\([^,]+,\s*[\'\"]' . preg_quote($token, '/') . '[\'\"](?:\s*,[^)]*)?\s*\)/m';
            preg_match_all($pattern, $styleFileContents, $matches);
            $used = !empty($matches[0]);

            if (!$used) {
                $missingTokens[] = $token;
            }
        }

        $this->assertEmpty(
            $missingTokens,
            sprintf(
                "Component '%s' has declared but unused tokens in %s:%s- %s",
                $component,
                $styleFile,
                PHP_EOL,
                implode(PHP_EOL . '- ', $missingTokens),
            ),
        );
    }

    private static function extractTokensFromTokenFile(string $tokenFile): array
    {
        $content = file_get_contents($tokenFile);
        $data = json_decode($content, true);

        return $data['tokens'] ?? [];
    }

    public static function componentFilesProvider(): \Generator
    {
        $componentsDir = __DIR__ . '/../';
        $components = [
            'acceptance',
            'accordion',
            // 'anchormenu',
            'avatar',
            'block',
            'blockquote',
            'box',
            'brand',
            'breadcrumb',
            'button',
            'card',
            'code',
            'collection',
            'comment',
            'datebadge',
            'typography',
            'select',
        ];

        foreach ($components as $component) {
            $tokenFile = $componentsDir . $component . '/component.json';
            $styleFile = $componentsDir . $component . '/style.scss';

            yield $component => [$component, $tokenFile, $styleFile];
        }

        return;
    }
}
