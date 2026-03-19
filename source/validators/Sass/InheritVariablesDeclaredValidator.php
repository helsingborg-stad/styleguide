<?php

namespace HbgStyleGuide\Validators\Sass;

use HbgStyleGuide\Validators\ValidationResult;
use HbgStyleGuide\Validators\ValidatorInterface;

/**
 * Validates that every --inherit-* CSS custom property used in a SCSS file
 * is declared using @property with inherits: false.
 *
 * The --inherit-* naming convention is a project-wide pattern for CSS custom
 * properties that are intentionally non-inheriting runtime hooks. Declaring
 * them with @property and inherits: false is required so that the browser
 * treats them as registered properties and prevents unintended cascade.
 */
class InheritVariablesDeclaredValidator implements ValidatorInterface
{
    /**
     * Validates that all --inherit-* variables in the given file are declared
     * as @property blocks with inherits: false.
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

        $declared = $this->parsePropertyDeclarations($content);
        $this->checkUndeclaredUsages($content, $declared, $result);

        return $result;
    }

    /**
     * Parses all @property --inherit-* blocks and returns a map of:
     *   variable name => line number of the @property declaration
     * for those that correctly declare inherits: false.
     *
     * Also records violations for any @property --inherit-* block that is
     * missing the inherits: false descriptor.
     *
     * @param string           $content File content.
     *
     * @return array<string, int> Map of properly declared variable names to their line numbers.
     */
    private function parsePropertyDeclarations(string $content): array
    {
        // Dummy result; violations from this phase are discarded here and
        // re-emitted via validatePropertyBlocks() called from validate().
        // We use a separate early-return helper instead.
        return $this->collectDeclaredProperties($content);
    }

    /**
     * Collects all @property --inherit-* blocks from the file content and
     * returns variable names that correctly declare inherits: false.
     *
     * @param string $content File content.
     *
     * @return array<string, int> Map of variable name => @property declaration line number.
     */
    private function collectDeclaredProperties(string $content): array
    {
        $declared = [];
        $lines = explode("\n", $content);

        $blockStart = null;
        $blockVarName = null;
        $blockBody = '';
        $braceDepth = 0;

        foreach ($lines as $index => $line) {
            $lineNumber = $index + 1;

            if ($blockVarName === null) {
                // Look for the start of an @property --inherit-* rule.
                if (preg_match('/^\s*@property\s+(--inherit-[\w-]+)\s*\{?/', $line, $matches)) {
                    $blockVarName = $matches[1];
                    $blockStart = $lineNumber;
                    $blockBody = $line;
                    $braceDepth = substr_count($line, '{') - substr_count($line, '}');

                    if ($braceDepth <= 0) {
                        // Single-line block (unusual but handle gracefully).
                        if ($this->blockHasInheritsOff($blockBody)) {
                            $declared[$blockVarName] = $blockStart;
                        }
                        $blockVarName = null;
                        $blockBody = '';
                        $blockStart = null;
                    }
                }
            } else {
                // We are inside an @property block; accumulate lines.
                $blockBody .= "\n" . $line;
                $braceDepth += substr_count($line, '{') - substr_count($line, '}');

                if ($braceDepth <= 0) {
                    // Block closed.
                    if ($this->blockHasInheritsOff($blockBody)) {
                        $declared[$blockVarName] = $blockStart;
                    }
                    $blockVarName = null;
                    $blockBody = '';
                    $blockStart = null;
                }
            }
        }

        return $declared;
    }

    /**
     * Returns true when the given block body contains the "inherits: false" descriptor.
     *
     * @param string $blockBody Raw text of the @property block.
     *
     * @return bool
     */
    private function blockHasInheritsOff(string $blockBody): bool
    {
        return (bool) preg_match('/inherits\s*:\s*false/', $blockBody);
    }

    /**
     * Collects all @property --inherit-* block names regardless of their
     * inherits descriptor, mapping name => line number.
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
     * Checks all var(--inherit-*) usages against declared properties and adds
     * violations to the result for:
     *   - @property --inherit-* blocks missing inherits: false
     *   - var(--inherit-*) references without any corresponding @property inherits: false
     *
     * @param string              $content  The full file content.
     * @param array<string, int>  $declared Map of properly declared variable names.
     * @param ValidationResult    $result   Result collector.
     *
     * @return void
     */
    private function checkUndeclaredUsages(
        string $content,
        array $declared,
        ValidationResult $result,
    ): void {
        $allDeclared = $this->collectAllPropertyDeclarations($content);

        // Report @property --inherit-* blocks that are missing inherits: false.
        foreach ($allDeclared as $varName => $lineNumber) {
            if (!isset($declared[$varName])) {
                $result->addViolation(
                    $lineNumber,
                    "@property '{$varName}' is declared but is missing 'inherits: false'",
                    "@property {$varName} { ... }",
                );
            }
        }

        // Report var(--inherit-*) usages without a valid @property declaration.
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
                        "CSS variable '{$varName}' is used but not declared as '@property {$varName} { inherits: false }'",
                        trim($line),
                    );
                }
            }
        }
    }
}
