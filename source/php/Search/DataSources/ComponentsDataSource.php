<?php

namespace MunicipioStyleGuide\Search\DataSources;

use MunicipioStyleGuide\Search\DataSource;

/**
 * Search data source for styleguide components.
 */
class ComponentsDataSource implements DataSource
{
    /**
     * @param string $componentsPath Absolute path to component directories.
     */
    public function __construct(
        private string $componentsPath,
    ) {}

    /**
     * @return string
     */
    public function getCategory(): string
    {
        return 'components';
    }

    /**
     * @param string $query
     * @param int $limit
     *
     * @return array<int, array<string, mixed>>
     */
    public function search(string $query, int $limit = 10): array
    {
        $normalizedQuery = $this->normalize($query);
        if ($normalizedQuery === '') {
            return [];
        }

        $queryTokens = $this->tokenize($normalizedQuery);
        $componentConfigPaths = glob(rtrim($this->componentsPath, '/') . '/*/component.json') ?: [];
        $results = [];

        foreach ($componentConfigPaths as $componentConfigPath) {
            $component = $this->readComponentConfig($componentConfigPath);
            if ($component === null) {
                continue;
            }

            $score = $this->calculateScore(
                $normalizedQuery,
                $queryTokens,
                $component['slug'],
                $component['name'],
                $component['description'],
                $component['keywords'],
            );

            if ($score <= 0) {
                continue;
            }

            $results[] = [
                'slug' => $component['slug'],
                'name' => $component['name'],
                'description' => $component['description'],
                'url' => '/components/' . $component['slug'],
                'score' => $score,
            ];
        }

        usort($results, function (array $left, array $right): int {
            $scoreComparison = ((int) $right['score']) <=> ((int) $left['score']);
            if ($scoreComparison !== 0) {
                return $scoreComparison;
            }

            return strcasecmp((string) $left['name'], (string) $right['name']);
        });

        return array_slice($results, 0, max(0, $limit));
    }

    /**
     * @param string $componentConfigPath
     *
     * @return array<string, mixed>|null
     */
    private function readComponentConfig(string $componentConfigPath): ?array
    {
        $contents = file_get_contents($componentConfigPath);
        if ($contents === false) {
            return null;
        }

        $config = json_decode($contents, true);
        if (!is_array($config)) {
            return null;
        }

        $slug = isset($config['slug']) ? strtolower(trim((string) $config['slug'])) : '';
        $name = isset($config['name']) ? trim((string) $config['name']) : '';

        if ($slug === '' || $name === '') {
            return null;
        }

        $description = isset($config['description']) ? trim((string) $config['description']) : '';
        $keywords = $this->extractKeywords($config);

        return [
            'slug' => $slug,
            'name' => $name,
            'description' => $description,
            'keywords' => $keywords,
        ];
    }

    /**
     * @param array<string, mixed> $config
     *
     * @return array<int, string>
     */
    private function extractKeywords(array $config): array
    {
        $rawKeywords = [];

        foreach (['keywords', 'tags'] as $key) {
            if (!isset($config[$key]) || !is_array($config[$key])) {
                continue;
            }

            foreach ($config[$key] as $value) {
                if (!is_scalar($value)) {
                    continue;
                }

                $rawKeywords[] = trim((string) $value);
            }
        }

        $normalizedKeywords = array_map(fn (string $keyword): string => $this->normalize($keyword), $rawKeywords);
        $filteredKeywords = array_filter($normalizedKeywords, fn (string $keyword): bool => $keyword !== '');

        return array_values(array_unique($filteredKeywords));
    }

    /**
     * @param string $query
     * @param array<int, string> $queryTokens
     * @param string $slug
     * @param string $name
     * @param string $description
     * @param array<int, string> $keywords
     *
     * @return int
     */
    private function calculateScore(
        string $query,
        array $queryTokens,
        string $slug,
        string $name,
        string $description,
        array $keywords,
    ): int {
        $normalizedSlug = $this->normalize($slug);
        $normalizedName = $this->normalize($name);
        $normalizedDescription = $this->normalize($description);

        $score = 0;

        if ($normalizedSlug === $query || $normalizedName === $query) {
            $score += 120;
        }

        if (str_starts_with($normalizedSlug, $query)) {
            $score += 80;
        }

        if (str_starts_with($normalizedName, $query)) {
            $score += 70;
        }

        if (str_contains($normalizedSlug, $query)) {
            $score += 35;
        }

        if (str_contains($normalizedName, $query)) {
            $score += 25;
        }

        foreach ($queryTokens as $token) {
            if ($token === '') {
                continue;
            }

            if (str_contains($normalizedName, $token)) {
                $score += 12;
            }

            if (str_contains($normalizedDescription, $token)) {
                $score += 8;
            }

            foreach ($keywords as $keyword) {
                if ($keyword === $token) {
                    $score += 14;
                    continue;
                }

                if (str_contains($keyword, $token)) {
                    $score += 6;
                }
            }
        }

        similar_text($query, $normalizedSlug, $slugSimilarityPercent);
        similar_text($query, $normalizedName, $nameSimilarityPercent);
        $score += (int) floor(max($slugSimilarityPercent, $nameSimilarityPercent) / 8);

        return $score;
    }

    /**
     * @param string $value
     *
     * @return string
     */
    private function normalize(string $value): string
    {
        return strtolower(trim((string) preg_replace('/\s+/', ' ', $value)));
    }

    /**
     * @param string $value
     *
     * @return array<int, string>
     */
    private function tokenize(string $value): array
    {
        $tokens = preg_split('/[^a-z0-9]+/i', $value) ?: [];
        $normalizedTokens = array_map(fn (string $token): string => $this->normalize($token), $tokens);
        $filteredTokens = array_filter($normalizedTokens, fn (string $token): bool => $token !== '');

        return array_values(array_unique($filteredTokens));
    }
}
