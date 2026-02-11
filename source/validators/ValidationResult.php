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

        $file = $filePath ? basename($filePath) : '';
        $rows = [];

        foreach ($this->violations as $v) {
            $rows[] = [
                'file'    => $file,
                'line'    => (string) $v['line'],
                'message' => $v['message'],
                'context' => $v['content'],
            ];
        }

        return self::formatTable(['File', 'Line', 'Message', 'Context'], $rows);
    }

    /** @param string[] $headers @param array<int, array<string, string>> $rows */
    private static function formatTable(array $headers, array $rows): string
    {
        $keys = ['file', 'line', 'message', 'context'];

        // Calculate column widths
        $widths = [];
        foreach ($keys as $i => $key) {
            $widths[$key] = mb_strlen($headers[$i]);
        }
        foreach ($rows as $row) {
            foreach ($keys as $key) {
                $widths[$key] = max($widths[$key], mb_strlen($row[$key] ?? ''));
            }
        }

        // Cap context column to avoid excessively wide output
        $widths['context'] = min($widths['context'], 60);

        // Build separator and header
        $sep = '+';
        foreach ($keys as $key) {
            $sep .= str_repeat('-', $widths[$key] + 2) . '+';
        }

        $headerLine = '|';
        foreach ($keys as $i => $key) {
            $headerLine .= ' ' . str_pad($headers[$i], $widths[$key]) . ' |';
        }

        $lines = [$sep, $headerLine, $sep];

        // Build rows
        foreach ($rows as $row) {
            $line = '|';
            foreach ($keys as $key) {
                $val = $row[$key] ?? '';
                if (mb_strlen($val) > $widths[$key]) {
                    $val = mb_substr($val, 0, $widths[$key] - 3) . '...';
                }
                $line .= ' ' . str_pad($val, $widths[$key]) . ' |';
            }
            $lines[] = $line;
        }

        $lines[] = $sep;

        return "\n" . implode("\n", $lines);
    }
}
