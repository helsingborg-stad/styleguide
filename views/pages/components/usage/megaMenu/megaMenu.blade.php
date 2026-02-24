@button([
    'id' => 'mega-menu-trigger-open',
    'color' => 'primary',
    'text' => 'Open hamburger menu',
    'classList' => [
        'mega-menu-trigger',
    ],
    'attributeList' => [
        'data-js-mega-menu-trigger' => 'mega-menu',
    ]
])
@endbutton

@megaMenu([
    'id' => 'mega-menu',
    'menuItems' => [
        [
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
