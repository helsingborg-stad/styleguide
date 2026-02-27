@pagination([
    'list' => [
        ['href' => '/components/organisms/pagination?pagination=1', 'label' => 'Page 1'],
        ['href' => '/components/organisms/pagination?pagination=2', 'label' => 'Page 2'],
        ['href' => '/components/organisms/pagination?pagination=3', 'label' => 'Page 3'],
        ['href' => '/components/organisms/pagination?pagination=4', 'label' => 'Page 4'],
        ['href' => '/components/organisms/pagination?pagination=5', 'label' => 'Page 5'],
        ['href' => '/components/organisms/pagination?pagination=6', 'label' => 'Page 6'],
        ['href' => '/components/organisms/pagination?pagination=7', 'label' => 'Page 7'],
        ['href' => '/components/organisms/pagination?pagination=8', 'label' => 'Page 8'],
        ['href' => '/components/organisms/pagination?pagination=9', 'label' => 'Page 9'],
        ['href' => '/components/organisms/pagination?pagination=10', 'label' => 'Page 10'],
        ['href' => '/components/organisms/pagination?pagination=11', 'label' => 'Page 11'],
        ['href' => '/components/organisms/pagination?pagination=12', 'label' => 'Page 12'],
        ['href' => '/components/organisms/pagination?pagination=13', 'label' => 'Page 13'],
        ['href' => '/components/organisms/pagination?pagination=14', 'label' => 'Page 14'],
        ['href' => '/components/organisms/pagination?pagination=15', 'label' => 'Page 15'],
    ],
    'current' => isset($_GET['pagination']) ? $_GET['pagination'] : 1
])
@endpagination