<?php

namespace HbgStyleGuide\Contracts;

/**
 * Contract for loading JSON based data.
 */
interface JsonDataLoaderInterface
{
    /**
     * Loads and decodes a JSON file.
     *
     * @param string $relativePath Relative path from project root.
     *
     * @return array<mixed>
     */
    public function load(string $relativePath): array;
}
