<?php

namespace MunicipioStyleGuide\Tests;

use MunicipioStyleGuide\Search\DataSource;
use MunicipioStyleGuide\Search\Search;
use PHPUnit\Framework\TestCase;

/**
 * @covers \MunicipioStyleGuide\Search\Search
 */
class SearchTest extends TestCase
{
    /**
     * @return void
     */
    public function testSearchReturnsCategorizedResultsInProvidedDataSourceOrder(): void
    {
        $componentsDataSource = new SearchTestFakeDataSource('components', [
            ['name' => 'Button', 'slug' => 'button', 'score' => 100],
        ]);
        $docsDataSource = new SearchTestFakeDataSource('docs', [
            ['title' => 'Buttons Guide', 'slug' => 'buttons-guide', 'score' => 70],
        ]);

        $search = new Search($componentsDataSource, $docsDataSource);

        $result = $search->search('button', 5);

        $this->assertSame('button', $result['query']);
        $this->assertSame(['components', 'docs'], array_keys($result['results']));
        $this->assertCount(1, $result['results']['components']);
        $this->assertCount(1, $result['results']['docs']);
    }

    /**
     * @return void
     */
    public function testSearchReturnsEmptyArraysForBlankQuery(): void
    {
        $componentsDataSource = new SearchTestFakeDataSource('components', [
            ['name' => 'Button', 'slug' => 'button', 'score' => 100],
        ]);
        $docsDataSource = new SearchTestFakeDataSource('docs', [
            ['title' => 'Buttons Guide', 'slug' => 'buttons-guide', 'score' => 70],
        ]);

        $search = new Search($componentsDataSource, $docsDataSource);

        $result = $search->search('   ', 5);

        $this->assertSame('', $result['query']);
        $this->assertSame([], $result['results']['components']);
        $this->assertSame([], $result['results']['docs']);
    }
}

/**
 * Fake data source for Search unit tests.
 */
class SearchTestFakeDataSource implements DataSource
{
    /**
     * @param string $category
     * @param array<int, array<string, mixed>> $items
     */
    public function __construct(
        private string $category,
        private array $items,
    ) {}

    /**
     * @return string
     */
    public function getCategory(): string
    {
        return $this->category;
    }

    /**
     * @param string $query
     * @param int $limit
     *
     * @return array<int, array<string, mixed>>
     */
    public function search(string $query, int $limit = 10): array
    {
        return array_slice($this->items, 0, $limit);
    }
}
