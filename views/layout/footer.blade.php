@footer([
    'classList' => ['u-margin__top--8', 'u-padding__x--6', 'u-padding__y--4', 'l-docs--footer', 'u-border__top--1'],
    'logotype' => '/assets/img/logotype-grey-full.svg',
    'links' => [
        'About' => [
            'Atomic design' => ['href' => '/components'],
        ],
        'Documentation' => [
            'Components' => ['href' => '/components'],
            'Scripts' => ['href' => '/script'],
            'Utilities' => ['href' => '/utilities']
        ],
        'Links' => [
            'Github (Styleguide)' => ['target' => '_blank', 'href' => 'https://github.com/helsingborg-stad/styleguide'],
            'Github (Component Library)' => ['target' => '_blank', 'href' => 'https://github.com/helsingborg-stad/blade-component-library'],
            'Helsingborg.se' => ['target' => '_blank', 'href' => 'https://getmunicipio.com'],
        ]

    ]
])
@endfooter
