@typography(['element' => 'h2', 'variant' => 'h2', 'classList' => ['u-margin__top--6']])
    Examples
@endtypography

@typography(['element' => 'p', 'variant' => 'body'])
    The site selector can represent the current site, related sites, or different audiences. Its colors are configured through the design tool, and the current site is highlighted automatically.
@endtypography

@paper(['padding' => 2, 'classList' => ['u-margin__bottom--4']])
    @siteselector([
        'items' => [
            ['label' => 'This site', 'href' => 'https://' . ($_SERVER['HTTP_HOST'] ?? '')],
            ['label' => 'Google', 'href' => 'https://google.com'],
            ['label' => 'Facebook', 'href' => 'https://facebook.com'],
            ['label' => 'Twitter', 'href' => 'https://twitter.com']
        ]
    ])
    @endsiteselector
@endpaper

@typography(['element' => 'h3', 'variant' => 'h3', 'classList' => ['u-margin__top--5']])
    Overflowing items
@endtypography

@paper(['padding' => 2, 'classList' => ['u-margin__bottom--4']])
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
@endpaper