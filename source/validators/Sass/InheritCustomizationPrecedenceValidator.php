<?php

namespace MunicipioStyleGuide\Validators\Sass;

use MunicipioStyleGuide\Validators\ValidationResult;
use MunicipioStyleGuide\Validators\ValidatorInterface;

/**
 * Validates that components with token-backed component settings do not use
 * legacy inherit-first fallback patterns that hide explicit component overrides.
 */
class InheritCustomizationPrecedenceValidator implements ValidatorInterface
{
    /**
     * Validates the given SCSS file.
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

        $content = file_get_contents($filePath);
        if ($content === false) {
            $result->addViolation(0, "Could not read file: {$filePath}");
            return $result;
        }

        if (!$this->usesTokenBackedComponentSettings($filePath)) {
            return $result;
        }

        $legacyPatterns = [
            '/var\(\s*--inherit-[\w-]+\s*,\s*tokens\.getRawValue\(/',
            '/var\(\s*--inherit-[\w-]+\s*,\s*#\{\s*map\.get\(/',
        ];
        $usesLegacyPattern = false;
        foreach ($legacyPatterns as $pattern) {
            if (preg_match($pattern, $content)) {
                $usesLegacyPattern = true;
                break;
            }
        }

        $inheritStringPattern = '"(?:--inherit-[^"]+|[^"-][^"]*)"';
        $helperPatterns = [
            '/tokens\.getRawValue\(\s*\$prefix:\s*[^,\n]+,\s*\$token:\s*' . $inheritStringPattern . '\s*,\s*\$inheritVariable:\s*' . $inheritStringPattern . '\s*\)/',
            '/tokens\.getCalculatedValue\(\s*\$prefix:\s*[^,\n]+,\s*\$token:\s*' . $inheritStringPattern . '\s*,\s*\$inheritVariable:\s*' . $inheritStringPattern . '\s*\)/',
            '/tokens\.getCalculatedValue\(\s*\$prefix:\s*[^,\n]+,\s*\$token:\s*' . $inheritStringPattern . '\s*,\s*\$multiplier:\s*[^,\n()]+,\s*\$inheritVariable:\s*' . $inheritStringPattern . '\s*\)/',
        ];
        $positionalHelperPatterns = [
            '/tokens\.getRawValue\((?![^)]*\$prefix\s*:)(?![^)]*\$token\s*:)(?![^)]*\$inheritVariable\s*:)[^)]*,[^)]*,[^)]*\)/',
            '/tokens\.getCalculatedValue\((?![^)]*\$prefix\s*:)(?![^)]*\$token\s*:)(?![^)]*\$inheritVariable\s*:)[^)]*,[^)]*,\s*' . $inheritStringPattern . '\s*\)/',
            '/tokens\.getCalculatedValue\((?![^)]*\$prefix\s*:)(?![^)]*\$token\s*:)(?![^)]*\$multiplier\s*:)(?![^)]*\$inheritVariable\s*:)[^)]*,[^)]*,[^)]*,[^)]*\)/',
        ];
        $usesNewPattern = false;
        foreach (explode("\n", $content) as $line) {
            foreach ($helperPatterns as $pattern) {
                if (preg_match($pattern, $line) === 1) {
                    $usesNewPattern = true;
                    break 2;
                }
            }
        }
        if (!$usesLegacyPattern && !$usesNewPattern) {
            return $result;
        }

        if ($usesNewPattern && !preg_match('/@include\s+tokens\.create\([^\n]*\$emitDefaultTokenVariables:\s*true/', $content)) {
            $result->addViolation(
                0,
                'Components that combine token-backed component settings with --inherit-* hooks must register token defaults with @include tokens.create(..., $emitDefaultTokenVariables: true).',
            );
        }

        $lines = explode("\n", $content);
        foreach ($lines as $index => $line) {
            foreach ($legacyPatterns as $pattern) {
                if (preg_match($pattern, $line)) {
                    $result->addViolation(
                        $index + 1,
                        'Use tokens.getRawValue(..., "color-background") or tokens.getCalculatedValue(..., "space", "color-background") so component overrides take precedence over --inherit-* fallbacks.',
                        trim($line),
                    );
                    break;
                }
            }

            foreach ($positionalHelperPatterns as $pattern) {
                if (preg_match($pattern, $line)) {
                    $result->addViolation(
                        $index + 1,
                        'Use named arguments for inherit-aware token helpers, for example tokens.getRawValue($prefix: $_, $token: "color--surface", $inheritVariable: "color-background").',
                        trim($line),
                    );
                    break;
                }
            }
        }

        return $result;
    }

    /**
     * Checks whether the component adjacent to the SCSS file declares any
     * token-backed component settings.
     *
     * @param string $filePath Absolute path to the SCSS file.
     *
     * @return bool
     */
    private function usesTokenBackedComponentSettings(string $filePath): bool
    {
        $componentConfigPath = dirname($filePath) . '/component.json';
        if (!is_readable($componentConfigPath)) {
            return false;
        }

        $rawConfig = file_get_contents($componentConfigPath);
        if ($rawConfig === false) {
            return false;
        }

        $componentConfig = json_decode($rawConfig, true);
        if (!is_array($componentConfig)) {
            return false;
        }

        $componentSettings = $componentConfig['componentSettings'] ?? null;
        if (!is_array($componentSettings)) {
            return false;
        }

        foreach ($componentSettings as $category) {
            if (!is_array($category)) {
                continue;
            }

            $settings = $category['settings'] ?? null;
            if (!is_array($settings)) {
                continue;
            }

            foreach ($settings as $setting) {
                if (!is_array($setting)) {
                    continue;
                }

                if (isset($setting['token']) && is_string($setting['token']) && trim($setting['token']) !== '') {
                    return true;
                }
            }
        }

        return false;
    }
}
