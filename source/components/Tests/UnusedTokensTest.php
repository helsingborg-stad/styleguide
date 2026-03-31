<?php

namespace MunicipioStyleGuide\Components\Tests;

use PHPUnit\Framework\TestCase;

class UnusedTokensTest extends TestCase
{
    private const SHADOW_TOKEN = 'shadow';
    private const SHADOW_REQUIRED_TOKENS = ['shadow-amount', 'shadow-color'];
    private const TOKEN_EXCEPTIONS = self::SHADOW_REQUIRED_TOKENS;

    /**
     * @testdox component utilizes all tokens declared in component.json
     * @dataProvider componentFilesProvider
     */
    public function testComponentUtilizeAllTokens(string $component, string $tokenFile, string $styleFile): void
    {
        $tokens = self::extractTokensFromTokenFile($tokenFile);
        $styleFileContents = (string) file_get_contents($styleFile);

        self::assertShadowDependenciesAreDeclared($tokens, $styleFileContents, $component);
        $unusedTokens = self::findUnusedTokens($tokens, $styleFileContents, self::TOKEN_EXCEPTIONS);

        $errorMessage = sprintf("Component '%s' has declared but unused tokens in %s:%s- %s", $component, $styleFile, PHP_EOL, implode(PHP_EOL . '- ', $unusedTokens));
        $this->assertEmpty($unusedTokens, $errorMessage);
    }

    private static function assertShadowDependenciesAreDeclared(
        array $tokens,
        string $styleFileContents,
        string $component,
    ): void {
        if (!self::styleFileUsesToken($styleFileContents, self::SHADOW_TOKEN)) {
            return;
        }

        $missingTokens = array_values(array_diff(self::SHADOW_REQUIRED_TOKENS, $tokens));

        self::assertEmpty(
            $missingTokens,
            sprintf(
                "Component '%s' is missing required shadow tokens: %s",
                $component,
                implode(', ', $missingTokens),
            ),
        );
    }

    private static function findUnusedTokens(array $tokens, string $styleFileContents, array $excludedTokens): array
    {
        $unusedTokens = [];

        foreach ($tokens as $token) {
            if (in_array($token, $excludedTokens, true)) {
                continue;
            }

            if (!self::styleFileUsesToken($styleFileContents, $token)) {
                $unusedTokens[] = $token;
            }
        }

        return $unusedTokens;
    }

    private static function styleFileUsesToken(string $styleFileContents, string $token): bool
    {
        // Match tokens.use/get(<anything>, '<token>'[, <optional args>])
        $pattern = '/tokens\.(use|get)\s*\([^,]+,\s*[\'\"]' . preg_quote($token, '/') . '[\'\"](?:\s*,[^)]*)?\s*\)/m';

        return preg_match($pattern, $styleFileContents) === 1;
    }

    private static function extractTokensFromTokenFile(string $tokenFile): array
    {
        $content = (string) file_get_contents($tokenFile);
        $data = json_decode($content, true);

        if (!is_array($data)) {
            return [];
        }

        return $data['tokens'] ?? [];
    }

    public static function componentFilesProvider(): \Generator
    {
        $componentsDir = __DIR__ . '/../';
        $componentExceptions = ['Tests']; // Exclude test directory itself
        $components = array_filter(scandir($componentsDir), function ($item) use ($componentsDir, $componentExceptions) {
            return is_dir($componentsDir . $item) && !in_array($item, ['.', '..', ...$componentExceptions], true);
        });

        foreach ($components as $component) {
            $tokenFile = $componentsDir . $component . '/component.json';
            $styleFile = $componentsDir . $component . '/style.scss';

            yield $component => [$component, $tokenFile, $styleFile];
        }

        return;
    }
}
