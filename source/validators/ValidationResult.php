<?php

namespace HbgStyleGuide\Validators;

class ValidationResult
{
    /** @var array<int, array{line: int, message: string, content: string}> */
    private array $violations = [];

    public function addViolation(int $line, string $message, string $content = ''): void
    {
        $this->violations[] = [
            'line'    => $line,
            'message' => $message,
            'content' => trim($content),
        ];
    }

    public function isValid(): bool
    {
        return empty($this->violations);
    }

    /** @return array<int, array{line: int, message: string, content: string}> */
    public function getViolations(): array
    {
        return $this->violations;
    }

    public function format(string $filePath = ''): string
    {
        if ($this->isValid()) {
            return 'No violations found.';
        }

        $prefix = $filePath ? basename($filePath) . ': ' : '';
        $lines  = [];

        foreach ($this->violations as $v) {
            $lines[] = sprintf(
                "%sLine %d: %s%s",
                $prefix,
                $v['line'],
                $v['message'],
                $v['content'] ? " → {$v['content']}" : ''
            );
        }

        return implode("\n", $lines);
    }
}
