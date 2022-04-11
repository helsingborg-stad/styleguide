@button([
    'id' => 'hamburger-menu-trigger-open',
    'color' => 'primary',
    'text' => 'Open hamburger menu',
    'classList' => [
        'hamburger-menu-trigger',
    ],
    'attributeList' => [
        'data-js-toggle-trigger' => 'hamburger-menu',
    ]
])
@endbutton

@hamburgerMenu([
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
@endhamburgerMenu