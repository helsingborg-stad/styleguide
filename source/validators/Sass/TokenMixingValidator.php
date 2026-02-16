<?php

namespace HbgStyleGuide\Validators\Sass;

use HbgStyleGuide\Validators\ValidatorInterface;
use HbgStyleGuide\Validators\ValidationResult;

class TokenMixingValidator implements ValidatorInterface
{
    /** @var string[] Sass built-in module namespaces to ignore */
    private const SASS_BUILTINS = ['map', 'list', 'math', 'string', 'meta', 'selector', 'color'];

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

            // Skip @use and @forward declarations
            if (preg_match('/^\s*@(use|forward)\s/', $stripped)) {
                continue;
            }

            // Match namespaced Sass variable references: module.$variable
            if (preg_match_all('/([\w-]+)\.\$([a-zA-Z_][\w-]*)/', $stripped, $matches, PREG_SET_ORDER)) {
                foreach ($matches as $match) {
                    $module   = $match[1];
                    $variable = $match[0];

                    if (in_array($module, self::SASS_BUILTINS, true)) {
                        continue;
                    }

                    $result->addViolation(
                        $lineNumber,
                        "Token mixing: use CSS custom property instead of '{$variable}'",
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
