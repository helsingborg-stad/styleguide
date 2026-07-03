<?php

namespace MunicipioStyleGuide\Components\Tests;

use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\Attributes\TestDox;
use PHPUnit\Framework\TestCase;

/**
 * Ensures token references in component settings are declared in tokens.
 */
class ComponentSettingsTokenReferencesTest extends TestCase
{
    /**
     * Verifies that every setting token is present in the component token list.
     */
    #[TestDox('component "$component" only references declared tokens in componentSettings')]
    #[DataProvider('componentFilesProvider')]
    public function testComponentSettingsOnlyReferenceDeclaredTokens(string $component, string $componentFile): void
    {
        $componentData = self::readComponentFile($componentFile);
        $declaredTokens = self::extractDeclaredTokens($componentData);
        $missingTokenReferences = self::findMissingTokenReferences($componentData, $declaredTokens);

        self::assertEmpty(
            $missingTokenReferences,
            sprintf(
                "Component '%s' contains token references that are missing from tokens[]:%s- %s",
                $component,
                PHP_EOL,
                implode(PHP_EOL . '- ', $missingTokenReferences),
            ),
        );
    }

    /**
     * Reads and decodes a component definition file.
     *
     * @return array<string, mixed>
     */
    private static function readComponentFile(string $componentFile): array
    {
        $content = (string) file_get_contents($componentFile);
        $decoded = json_decode($content, true);

        return is_array($decoded) ? $decoded : [];
    }

    /**
     * Extracts top-level declared tokens from a component definition.
     *
     * @param array<string, mixed> $componentData
     *
     * @return array<int, string>
     */
    private static function extractDeclaredTokens(array $componentData): array
    {
        if (!isset($componentData['tokens']) || !is_array($componentData['tokens'])) {
            return [];
        }

        return array_values(array_filter($componentData['tokens'], fn ($token) => is_string($token)));
    }

    /**
     * Finds token references used in componentSettings that are not declared in tokens.
     *
     * @param array<string, mixed> $componentData
     * @param array<int, string> $declaredTokens
     *
     * @return array<int, string>
     */
    private static function findMissingTokenReferences(array $componentData, array $declaredTokens): array
    {
        if (!isset($componentData['componentSettings']) || !is_array($componentData['componentSettings'])) {
            return [];
        }

        $declaredTokenLookup = array_fill_keys($declaredTokens, true);
        $missingReferences = [];

        foreach ($componentData['componentSettings'] as $category) {
            if (!is_array($category) || !isset($category['settings']) || !is_array($category['settings'])) {
                continue;
            }

            $categoryId = is_string($category['id'] ?? null) ? $category['id'] : 'unknown';

            foreach ($category['settings'] as $setting) {
                if (!is_array($setting) || !is_string($setting['token'] ?? null)) {
                    continue;
                }

                $token = $setting['token'];

                if (!isset($declaredTokenLookup[$token])) {
                    $missingReferences[] = sprintf('category "%s" token "%s"', $categoryId, $token);
                }
            }
        }

        return $missingReferences;
    }

    /**
     * Provides component definition files for validation.
     *
     * @return \Generator<string, array{0: string, 1: string}>
     */
    public static function componentFilesProvider(): \Generator
    {
        $componentsDir = __DIR__ . '/../';
        $componentExceptions = ['Tests'];
        $components = array_filter(scandir($componentsDir), function ($item) use ($componentsDir, $componentExceptions) {
            return is_dir($componentsDir . $item) && !in_array($item, ['.', '..', ...$componentExceptions], true);
        });

        foreach ($components as $component) {
            $componentFile = $componentsDir . $component . '/component.json';

            if (!file_exists($componentFile)) {
                continue;
            }

            yield $component => [$component, $componentFile];
        }
    }
}
