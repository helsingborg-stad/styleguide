<?php

namespace MunicipioStyleGuide\Tests;

use MunicipioStyleGuide\Controllers\ApiController;
use MunicipioStyleGuide\Data\JsonDataLoader;
use MunicipioStyleGuide\Data\NavigationApiDataProvider;
use MunicipioStyleGuide\Http\Request;
use MunicipioStyleGuide\Http\Response;
use MunicipioStyleGuide\Search\DataSource;
use MunicipioStyleGuide\Search\Search;
use PHPUnit\Framework\TestCase;

/**
 * @covers \MunicipioStyleGuide\Controllers\ApiController
 */
class ApiControllerSearchTest extends TestCase
{
    /**
     * @return void
     */
    public function testIsSearchRequestReturnsTrueForSearchEndpoint(): void
    {
        $request = new Request('/search', ['q' => 'button']);
        $response = new ApiControllerTestResponse();
        $controller = $this->createApiController($request, $response);

        $result = $controller->isSearchRequest();

        $this->assertTrue($result);
    }

    /**
     * @return void
     */
    public function testHandleReturnsSearchPayloadForSearchEndpoint(): void
    {
        $request = new Request('/search', ['q' => 'button', 'limit' => '5']);
        $response = new ApiControllerTestResponse();
        $controller = $this->createApiController($request, $response);

        $controller->handle();

        $this->assertSame(200, $response->statusCode);
        $this->assertIsArray($response->payload);
        $this->assertSame('button', $response->payload['query']);
        $this->assertArrayHasKey('components', $response->payload['results']);
        $this->assertCount(1, $response->payload['results']['components']);
    }

    /**
     * @param Request $request
     * @param ApiControllerTestResponse $response
     *
     * @return ApiController
     */
    private function createApiController(Request $request, ApiControllerTestResponse $response): ApiController
    {
        return new ApiController(
            $request,
            $response,
            new NavigationApiDataProvider(new JsonDataLoader(sys_get_temp_dir())),
            new Search(
                new ApiControllerFakeDataSource('components', [
                    [
                        'name' => 'Button',
                        'slug' => 'button',
                        'url' => '/components/button',
                        'score' => 100,
                    ],
                ]),
            ),
        );
    }
}

/**
 * Response test double that captures payloads.
 */
class ApiControllerTestResponse extends Response
{
    /**
     * @var mixed
     */
    public mixed $payload = null;

    /**
     * @var int
     */
    public int $statusCode = 200;

    /**
     * @param mixed $payload
     * @param int $statusCode
     *
     * @return void
     */
    public function json(mixed $payload, int $statusCode = 200): void
    {
        $this->payload = $payload;
        $this->statusCode = $statusCode;
    }
}

/**
 * Data source test double used by API controller tests.
 */
class ApiControllerFakeDataSource implements DataSource
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
