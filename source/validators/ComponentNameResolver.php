<?php

namespace HbgStyleGuide\Validators;

class ComponentNameResolver
{
    public function resolve(string $filePath): ?string
    {
        $name = $this->resolveFromFilename($filePath);

        $classNameFromContent = $this->resolveFromContent($filePath);
        if ($classNameFromContent !== null) {
            return $classNameFromContent;
        }

        return $name;
    }

    private function resolveFromFilename(string $filePath): ?string
    {
        $basename = basename($filePath, '.scss');
        $basename = ltrim($basename, '_');

        return $basename !== '' ? $basename : null;
    }

    private function resolveFromContent(string $filePath): ?string
    {
        if (!is_readable($filePath)) {
            return null;
        }

        $content = file_get_contents($filePath);
        if ($content === false) {
            return null;
        }

        if (preg_match('/\.c-([a-z][a-z0-9-]*)/', $content, $matches)) {
            return $matches[1];
        }

        return null;
    }
}
