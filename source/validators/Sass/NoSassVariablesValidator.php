<?php

namespace HbgStyleGuide\Validators\Sass;

use HbgStyleGuide\Validators\ValidatorInterface;
use HbgStyleGuide\Validators\ValidationResult;

class NoSassVariablesValidator implements ValidatorInterface
{
    /** @var string[] Variable names or patterns to allow */
    private array $allowedExceptions;

    /** @param string[] $allowedExceptions */
    public function __construct(array $allowedExceptions = [])
    {
        $this->allowedExceptions = $allowedExceptions;
    }

    public function validate(string $filePath): ValidationResult
    {
        $result = new ValidationResult();

        if (!is_readable($filePath)) {
            $result->addViolation(0, "File not readable: {$filePath}");
            return $result;
        }

        $lines = file($filePath, FILE_IGNORE_NEW_LINES);
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

            // Match Sass variable patterns:
            // - $variable-name (bare variable)
            // - namespace.$variable-name (@use namespace reference)
            if (preg_match_all('/(?:[\w-]+\.)?\$[a-zA-Z_][\w-]*/', $stripped, $matches)) {
                foreach ($matches[0] as $match) {
                    if ($this->isAllowed($match)) {
                        continue;
                    }

                    $result->addViolation(
                        $lineNumber,
                        "Sass variable found: {$match}",
                        $line
                    );
                }
            }
        }

        return $result;
    }

    private function isAllowed(string $variable): bool
    {
        foreach ($this->allowedExceptions as $exception) {
            if ($variable === $exception) {
                return true;
            }
            // Support wildcard patterns like "sass:*"
            if (str_contains($exception, '*')) {
                $pattern = '/^' . str_replace('\\*', '.*', preg_quote($exception, '/')) . '$/';
                if (preg_match($pattern, $variable)) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * Strip comments from a line, tracking block comment state.
     * Updates $inBlockComment by reference.
     */
    private function stripComments(string $line, bool &$inBlockComment): string
    {
        $result = '';
        $len    = strlen($line);
        $i      = 0;

        while ($i < $len) {
            if ($inBlockComment) {
                // Look for end of block comment
                $endPos = strpos($line, '*/', $i);
                if ($endPos === false) {
                    return $result; // Entire rest of line is in comment
                }
                $i = $endPos + 2;
                $inBlockComment = false;
                continue;
            }

            // Check for line comment
            if ($i + 1 < $len && $line[$i] === '/' && $line[$i + 1] === '/') {
                return $result; // Rest of line is a comment
            }

            // Check for block comment start
            if ($i + 1 < $len && $line[$i] === '/' && $line[$i + 1] === '*') {
                $inBlockComment = true;
                $i += 2;
                continue;
            }

            // Check for string literals (skip $ inside strings)
            if ($line[$i] === '"' || $line[$i] === "'") {
                $quote  = $line[$i];
                $endStr = strpos($line, $quote, $i + 1);
                if ($endStr !== false) {
                    $i = $endStr + 1;
                } else {
                    return $result; // Unterminated string
                }
                continue;
            }

            $result .= $line[$i];
            $i++;
        }

        return $result;
    }
}
