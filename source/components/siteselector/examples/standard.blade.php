@siteselector([
    'items' => [
        ['label' => 'This site', 'href' => 'https://' . ($_SERVER['HTTP_HOST'] ?? '')],
        ['label' => 'Google', 'href' => 'https://google.com'],
        ['label' => 'Facebook', 'href' => 'https://facebook.com'],
        ['label' => 'Twitter', 'href' => 'https://twitter.com']
    ]
])
@endsiteselector