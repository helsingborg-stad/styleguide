<?php

namespace MunicipioStyleGuide\Validators\Sass;

use MunicipioStyleGuide\Validators\ValidationResult;
use MunicipioStyleGuide\Validators\ValidatorInterface;

/**
 * Validates that token-backed component color settings expose every companion
 * family token that the component style consumes.
 */
class LocalizedColorTokenFamilyCoverageValidator implements ValidatorInterface
{
    /**
     * Validates the given component SCSS file.
     *
     * @param string $filePath Absolute path to the SCSS file to validate.
     *
     * @return ValidationResult
     */
    public function validate(string $filePath): ValidationResult
    {
        $result = new ValidationResult();

        if (!is_readable($filePath)) {
            $result->addViolation(0, "File not readable: {$filePath}");
            return $result;
        }

        $componentJsonPath = dirname($filePath) . '/component.json';
        if (!is_readable($componentJsonPath)) {
            return $result;
        }

        $componentDefinition = json_decode((string) file_get_contents($componentJsonPath), true);
        if (!is_array($componentDefinition)) {
            $result->addViolation(0, "Could not parse component definition: {$componentJsonPath}");
            return $result;
        }

        $componentTokens = array_values(array_filter(
            $componentDefinition['tokens'] ?? [],
            static fn ($token): bool => is_string($token) && $token !== '',
        ));
        $tokenLookup = array_fill_keys($componentTokens, true);

        $colorSettingFamilies = $this->collectTokenColorSettingFamilies($componentDefinition['componentSettings'] ?? []);
        if ($colorSettingFamilies === []) {
            return $result;
        }

        $content = file_get_contents($filePath);
        if ($content === false) {
            $result->addViolation(0, "Could not read file: {$filePath}");
            return $result;
        }

        $lines = explode("\n", $content);
        foreach ($colorSettingFamilies as $baseTokenName => $familyName) {
            $referencedTokens = $this->collectReferencedFamilyTokens($content, $familyName);
            foreach ($referencedTokens as $referencedToken) {
                if (isset($tokenLookup[$referencedToken])) {
                    continue;
                }

                $lineNumber = $this->findFirstMatchingLine($lines, $referencedToken);
                $result->addViolation(
                    $lineNumber,
                    sprintf(
                        'Token-backed color setting "%s" uses companion token "%s" in the component style, but that token is missing from component.json. Add it so localized color remapping can carry the full background/contrast family.',
                        $baseTokenName,
                        $referencedToken,
                    ),
                    $lineNumber > 0 ? trim($lines[$lineNumber - 1]) : null,
                );
            }
        }

        return $result;
    }

    /**
     * @param array<int, mixed> $componentSettings
     *
     * @return array<string, string>
     */
    private function collectTokenColorSettingFamilies(array $componentSettings): array
    {
        $families = [];

        foreach ($componentSettings as $category) {
            if (!is_array($category) || !isset($category['settings']) || !is_array($category['settings'])) {
                continue;
            }

            foreach ($category['settings'] as $setting) {
                if (!is_array($setting) || !isset($setting['token']) || !is_string($setting['token'])) {
                    continue;
                }

                $descriptor = $this->describeColorToken($setting['token']);
                if ($descriptor === null || $descriptor['variant'] !== 'base') {
                    continue;
                }

                $families[$setting['token']] = $descriptor['family'];
            }
        }

        return $families;
    }

    /**
     * @return array{family: string, variant: string}|null
     */
    private function describeColorToken(string $tokenName): ?array
    {
        if (!str_starts_with($tokenName, 'color--')) {
            return null;
        }

        $rawName = substr($tokenName, strlen('color--'));
        $suffixes = [
            '-contrast-muted' => 'contrast-muted',
            '-contrast' => 'contrast',
            '-border' => 'border',
            '-alt' => 'alt',
        ];

        foreach ($suffixes as $suffix => $variant) {
            if (str_ends_with($rawName, $suffix)) {
                return [
                    'family' => substr($rawName, 0, -strlen($suffix)),
                    'variant' => $variant,
                ];
            }
        }

        return [
            'family' => $rawName,
            'variant' => 'base',
        ];
    }

    /**
     * @return string[]
     */
    private function collectReferencedFamilyTokens(string $content, string $familyName): array
    {
        $pattern = '/color--' . preg_quote($familyName, '/') . '(?:-(?:contrast(?:-muted)?|border|alt))?/';
        preg_match_all($pattern, $content, $matches);

        $tokens = array_values(array_unique($matches[0] ?? []));
        sort($tokens);

        return $tokens;
    }

    /**
     * @param string[] $lines
     */
    private function findFirstMatchingLine(array $lines, string $needle): int
    {
        foreach ($lines as $index => $line) {
            if (str_contains($line, $needle)) {
                return $index + 1;
            }
        }

        return 0;
    }
}