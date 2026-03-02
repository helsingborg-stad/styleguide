<?php

namespace HbgStyleGuide\Search;

/**
 * Contract for a searchable data source.
 */
interface DataSource
{
    /**
     * Returns category key used in grouped search responses.
     *
     * @return string
     */
    public function getCategory(): string;

    /**
     * Executes search in this data source.
     *
     * @param string $query Search query.
     * @param int $limit Maximum number of items.
     *
     * @return array<int, array<string, mixed>>
     */
    public function search(string $query, int $limit = 10): array;
}
