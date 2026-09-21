@siteselector([
    'maxItems' => 2,
    'items' => [
        ['label' => 'Google', 'href' => 'https://google.com'],
        ['label' => 'This site', 'href' => 'https://' . ($_SERVER['HTTP_HOST'] ?? '')],
        ['label' => 'Facebook', 'href' => 'https://facebook.com'],
        ['label' => 'Twitter', 'href' => 'https://twitter.com']
    ]
])
@endsiteselector