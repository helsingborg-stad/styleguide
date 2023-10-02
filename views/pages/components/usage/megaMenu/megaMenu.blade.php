@button([
    'id' => 'mega-menu-trigger-open',
    'color' => 'primary',
    'text' => 'Open hamburger menu',
    'classList' => [
        'mega-menu-trigger',
    ],
    'attributeList' => [
        'data-js-toggle-trigger' => 'mega-menu',
    ]
])
@endbutton

@megaMenu([
    'menuItems' => [
        [
            'id' => 1,
            'label' => 'Styleguide',
            'children' => [
                [
                    'id' => 2,
                    'label' => 'Styleguide child',
                    'href' => '',
                    'classNames' => ''
                ]
            ],
            'href' => '',
            'classNames' => ''
        ]
    ],
])
@endmegaMenu