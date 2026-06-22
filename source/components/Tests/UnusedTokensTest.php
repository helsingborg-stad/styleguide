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
    public function testComponentUtilizeAllTokens(string $component, string $tokenFile, string $componentDir): void
    {
        $tokens = self::extractTokensFromTokenFile($tokenFile);
        $scssContents = self::readAllScssFiles($componentDir);

        self::assertShadowDependenciesAreDeclared($tokens, $scssContents, $component);
        $unusedTokens = self::findUnusedTokens($tokens, $scssContents, self::TOKEN_EXCEPTIONS);

        $errorMessage = sprintf("Component '%s' has declared but unused tokens in %s:%s- %s", $component, $componentDir, PHP_EOL, implode(PHP_EOL . '- ', $unusedTokens));
        $this->assertEmpty($unusedTokens, $errorMessage);
    }

    private static function componentHasScssFiles(string $componentDir): bool
    {
        $iterator = new \RecursiveIteratorIterator(
            new \RecursiveDirectoryIterator($componentDir, \RecursiveDirectoryIterator::SKIP_DOTS),
        );

        foreach ($iterator as $file) {
            if ($file->getExtension() === 'scss') {
                return true;
            }
        }

        return false;
    }

    private static function readAllScssFiles(string $componentDir): string
    {
        $contents = [];

        $iterator = new \RecursiveIteratorIterator(
            new \RecursiveDirectoryIterator($componentDir, \RecursiveDirectoryIterator::SKIP_DOTS),
        );

        foreach ($iterator as $file) {
            if ($file->getExtension() === 'scss') {
                $contents[] = (string) file_get_contents($file->getPathname());
            }
        }

        return implode("\n", $contents);
    }

    private static function assertShadowDependenciesAreDeclared(
        array $tokens,
        string $scssContents,
        string $component,
    ): void {
        if (!self::styleFileUsesToken($scssContents, self::SHADOW_TOKEN)) {
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

    private static function findUnusedTokens(array $tokens, string $scssContents, array $excludedTokens): array
    {
        $unusedTokens = [];

        foreach ($tokens as $token) {
            if (in_array($token, $excludedTokens, true)) {
                continue;
            }

            if (!self::styleFileUsesToken($scssContents, $token)) {
                $unusedTokens[] = $token;
            }
        }

        return $unusedTokens;
    }

    private static function styleFileUsesToken(string $scssContents, string $token): bool
    {
        $escapedToken = preg_quote($token, '/');
        $positionalPattern = '/tokens\.\w+\s*\([^,]+,\s*[\'\"]' . $escapedToken . '[\'\"]/m';
        $namedPattern = '/tokens\.\w+\s*\([^)]*\$token\s*:\s*[\'\"]' . $escapedToken . '[\'\"]/m';

        return preg_match($positionalPattern, $scssContents) === 1 || preg_match($namedPattern, $scssContents) === 1;
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
            $componentDir = $componentsDir . $component;

            if (!file_exists($tokenFile)) {
                continue;
            }

            if (!self::componentHasScssFiles($componentDir)) {
                continue;
            }

            yield $component => [$component, $tokenFile, $componentDir];
        }
    }
}
