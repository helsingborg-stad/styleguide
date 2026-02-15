<?php

namespace HbgStyleGuide\Validators\Sass;

use HbgStyleGuide\Validators\ValidatorInterface;
use HbgStyleGuide\Validators\ValidationResult;
use HbgStyleGuide\Validators\DesignTokensParser;

class CssVariablesReferencesDesignTokensValidator implements ValidatorInterface
{
    private string $tokensJsonPath;
    private string $varCssPath;
    private ?array $allowedVariables = null;

    public function __construct(string $tokensJsonPath, string $varCssPath)
    {
        $this->tokensJsonPath = $tokensJsonPath;
        $this->varCssPath     = $varCssPath;
    }

    public function validate(string $filePath): ValidationResult
    {
        $result = new ValidationResult();

        if (!is_readable($filePath)) {
            $result->addViolation(0, "File not readable: {$filePath}");
            return $result;
        }

        $allowed = $this->getAllowedVariables();
        $lines   = file($filePath, FILE_IGNORE_NEW_LINES);
        if ($lines === false) {
            $result->addViolation(0, "Could not read file: {$filePath}");
            return $result;
        }

        $inBlockComment = false;

        foreach ($lines as $index => $line) {
            $lineNumber = $index + 1;
            $stripped   = $this->stripComments($line, $inBlockComment);

            if (trim($stripped) === '') {
                continue;
            }

            // Match var(--name) references, including nested: var(--name, fallback)
            if (preg_match_all('/var\(\s*(--[\w-]+)/', $stripped, $matches)) {
                foreach ($matches[1] as $varName) {
                    // Component-scoped variables (--c-*) are always allowed
                    if (str_starts_with($varName, '--c-')) {
                        continue;
                    }

                    if (!in_array($varName, $allowed, true)) {
                        $result->addViolation(
                            $lineNumber,
                            "CSS variable reference '{$varName}' not found in design tokens",
                            $line
                        );
                    }
                }
            }
        }

        return $result;
    }

    /** @return string[] */
    private function getAllowedVariables(): array
    {
        if ($this->allowedVariables === null) {
            $parser = new DesignTokensParser();
            $this->allowedVariables = $parser->getAllowedVariables(
                $this->tokensJsonPath,
                $this->varCssPath
            );
        }

        return $this->allowedVariables;
    }

    private function stripComments(string $line, bool &$inBlockComment): string
    {
        $result = '';
        $len    = strlen($line);
        $i      = 0;

        while ($i < $len) {
            if ($inBlockComment) {
                $endPos = strpos($line, '*/', $i);
                if ($endPos === false) {
                    return $result;
                }
                $i = $endPos + 2;
                $inBlockComment = false;
                continue;
            }

            if ($i + 1 < $len && $line[$i] === '/' && $line[$i + 1] === '/') {
                return $result;
            }

            if ($i + 1 < $len && $line[$i] === '/' && $line[$i + 1] === '*') {
                $inBlockComment = true;
                $i += 2;
                continue;
            }

            if ($line[$i] === '"' || $line[$i] === "'") {
                $quote  = $line[$i];
                $endStr = strpos($line, $quote, $i + 1);
                if ($endStr !== false) {
                    $i = $endStr + 1;
                } else {
                    return $result;
                }
                continue;
            }

            $result .= $line[$i];
            $i++;
        }

        return $result;
    }
}
