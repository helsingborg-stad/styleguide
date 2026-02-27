@pagination(
    [
        'list' => [
            ['href' => '/components/pagination?pagination=1', 'label' => 'Page 1'],
            ['href' => '/components/pagination?pagination=2', 'label' => 'Page 2'],
            ['href' => '/components/pagination?pagination=3', 'label' => 'Page 3'],
        ],
        'current' => isset($_GET['pagination']) ? $_GET['pagination'] : 1
    ]
)
@endpagination



