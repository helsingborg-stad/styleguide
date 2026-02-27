<?php

namespace HbgStyleGuide\Data;

use HbgStyleGuide\Contracts\JsonDataLoaderInterface;

/**
 * Loads JSON files from project root.
 */
class JsonDataLoader implements JsonDataLoaderInterface
{
    /**
     * @param string $projectRoot Absolute project path.
     */
    public function __construct(
        private string $projectRoot,
    ) {}

    /**
     * @param string $relativePath Relative file path.
     *
     * @return array<mixed>
     */
    public function load(string $relativePath): array
    {
        $path = rtrim($this->projectRoot, '/') . '/' . ltrim($relativePath, '/');

        if (!file_exists($path)) {
            return [];
        }

        $contents = file_get_contents($path);
        if ($contents === false) {
            return [];
        }

        $decoded = json_decode($contents, true);
        return is_array($decoded) ? $decoded : [];
    }
}
