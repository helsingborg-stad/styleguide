<?php

namespace MunicipioStyleGuide\Validators\Sass;

use MunicipioStyleGuide\Validators\ValidationResult;
use MunicipioStyleGuide\Validators\ValidatorInterface;

/**
 * Validates that every --inherit-* CSS custom property used in a SCSS file
 * is declared using @property with an inherits descriptor (true or false).
 *
 * The --inherit-* naming convention is a project-wide pattern for CSS custom
 * properties that are intentionally registered runtime hooks. Declaring them
 * with @property is required so that the browser treats them as registered
 * properties with a defined inheritance behaviour.
 */
class InheritVariablesDeclaredValidator implements ValidatorInterface
{
    /**
     * Validates that all --inherit-* variables in the given file are declared
     * as @property blocks.
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

        $declared = $this->collectAllPropertyDeclarations($content);
        $this->checkUndeclaredUsages($content, $declared, $result);

        return $result;
    }

    /**
     * Collects all @property --inherit-* block names, mapping name => line number.
     *
     * @param string $content File content.
     *
     * @return array<string, int>
     */
    private function collectAllPropertyDeclarations(string $content): array
    {
        $all = [];
        $lines = explode("\n", $content);

        foreach ($lines as $index => $line) {
            if (preg_match('/^\s*@property\s+(--inherit-[\w-]+)/', $line, $matches)) {
                $all[$matches[1]] = $index + 1;
            }
        }

        return $all;
    }

    /**
     * Checks all var(--inherit-*) usages against declared @property blocks and
     * adds violations for any --inherit-* variable used without a declaration.
     *
     * @param string              $content  The full file content.
     * @param array<string, int>  $declared Map of declared variable names to line numbers.
     * @param ValidationResult    $result   Result collector.
     *
     * @return void
     */
    private function checkUndeclaredUsages(
        string $content,
        array $declared,
        ValidationResult $result,
    ): void {
        $lines = explode("\n", $content);

        foreach ($lines as $index => $line) {
            $lineNumber = $index + 1;

            if (!preg_match_all('/var\(\s*(--inherit-[\w-]+)/', $line, $matches)) {
                continue;
            }

            foreach ($matches[1] as $varName) {
                if (!isset($declared[$varName])) {
                    $result->addViolation(
                        $lineNumber,
                        "CSS variable '{$varName}' is used but not declared as '@property {$varName} { inherits: true|false }'",
                        trim($line),
                    );
                }
            }
        }
    }
}
