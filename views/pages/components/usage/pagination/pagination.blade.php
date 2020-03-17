@pagination([
    'list' => [
        ['href' => '/components/organisms/pagination?pagination=1', 'label' => 'Page 1'],
        ['href' => '/components/organisms/pagination?pagination=2', 'label' => 'Page 2'],
        ['href' => '/components/organisms/pagination?pagination=3', 'label' => 'Page 3'],
    ],
    'current' => isset($_GET['pagination']) ? $_GET['pagination'] : 1
])
@endpagination