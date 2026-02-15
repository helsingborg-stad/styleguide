<?php

namespace HbgStyleGuide\Validators\Sass;

use HbgStyleGuide\Validators\ValidatorInterface;
use HbgStyleGuide\Validators\ValidationResult;
use HbgStyleGuide\Validators\ComponentNameResolver;

class CssVariablesNamespacedValidator implements ValidatorInterface
{
    private ComponentNameResolver $nameResolver;

    public function __construct(?ComponentNameResolver $nameResolver = null)
    {
        $this->nameResolver = $nameResolver ?? new ComponentNameResolver();
    }

    public function validate(string $filePath): ValidationResult
    {
        $result = new ValidationResult();

        if (!is_readable($filePath)) {
            $result->addViolation(0, "File not readable: {$filePath}");
            return $result;
        }

        $componentName = $this->nameResolver->resolve($filePath);
        if ($componentName === null) {
            $result->addViolation(0, "Could not determine component name for: {$filePath}");
            return $result;
        }

        $lines = file($filePath, FILE_IGNORE_NEW_LINES);
        if ($lines === false) {
            $result->addViolation(0, "Could not read file: {$filePath}");
            return $result;
        }

        $allowedPrefix  = "--c-{$componentName}-";
        $inBlockComment = false;

        foreach ($lines as $index => $line) {
            $lineNumber = $index + 1;
            $stripped   = $this->stripComments($line, $inBlockComment);

            if (trim($stripped) === '') {
                continue;
            }

            // Match CSS custom property declarations: --name: value
            // Must start at beginning of line (after whitespace only) to avoid
            // matching BEM modifiers like &--modifier:pseudo or .c-name--modifier
            if (preg_match_all('/(?:^|\s)(--([\w-]+))\s*:(?!:)/', $stripped, $matches, PREG_SET_ORDER)) {
                foreach ($matches as $match) {
                    $propertyName = $match[1]; // e.g., --button-color

                    // Check if it starts with the allowed component prefix
                    if (str_starts_with($propertyName, $allowedPrefix)) {
                        continue;
                    }

                    $result->addViolation(
                        $lineNumber,
                        "CSS custom property '{$propertyName}' must be namespaced as '{$allowedPrefix}*'",
                        $line
                    );
                }
            }
        }

        return $result;
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
