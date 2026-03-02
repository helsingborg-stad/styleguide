<?php

namespace HbgStyleGuide\Search;

/**
 * Aggregates results from multiple search data sources.
 */
class Search
{
    /**
     * @var array<int, DataSource>
     */
    private array $dataSources;

    /**
     * @param DataSource ...$dataSources Search data sources in preferred response order.
     */
    public function __construct(DataSource ...$dataSources)
    {
        $this->dataSources = $dataSources;
    }

    /**
     * Performs search across all configured data sources.
     *
     * @param string $query Search query string.
     * @param int $limitPerCategory Maximum results per category.
     *
     * @return array<string, mixed>
     */
    public function search(string $query, int $limitPerCategory = 10): array
    {
        $normalizedQuery = trim($query);
        $results = [];

        foreach ($this->dataSources as $dataSource) {
            $category = $dataSource->getCategory();
            $results[$category] = $normalizedQuery === ''
                ? []
                : $dataSource->search($normalizedQuery, $limitPerCategory);
        }

        return [
            'query' => $normalizedQuery,
            'results' => $results,
        ];
    }
}
