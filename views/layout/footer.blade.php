@footer([
    'classList' => ['u-margin__top--8'],
    'logotype' => '/assets/img/logotype-grey-full.svg',
    'links' => [
        'About' => [
            'The styleguide' => ['href' => '/about/styleguide-structure'],
            'Atomic design' => ['href' => '/components'],
            'Accessability' => ['href' => '/about/accessability'],
            'Authors' => ['href' => '/about/authors']
        ],
        'Documentation' => [
            'Components' => ['href' => '/components'],
            'Icons' => ['href' => '/icons'],
            'Mixins' => ['href' => '/mixins'],
            'Scripts' => ['href' => '/script'],
            'Utilities' => ['href' => '/utilities']
        ],
        'Links' => [
            'Github (Styleguide)' => ['target' => '_blank', 'href' => 'https://github.com/helsingborg-stad/styleguide'],
            'Github (Component Library)' => ['target' => '_blank', 'href' => 'https://github.com/helsingborg-stad/blade-component-library'],
            'Helsingborg.se' => ['target' => '_blank', 'href' => 'https://helsingborg.se'],
        ]

    ]
])
@endfooter