@button([
    'id' => 'mega-menu-mobile-trigger',
    'color' => 'primary',
    'text' => 'Open menu',
    'attributeList' => [
        'data-js-mega-menu-trigger' => 'mega-menu-mobile',
    ]
])
@endbutton

@megaMenu([
    'id' => 'mega-menu-mobile',
    'mobile' => true,
    'menuItems' => [
        [
            'id' => 1,
            'label' => 'City services',
            'href' => '#',
            'children' => [
                ['id' => 2, 'label' => 'Permits', 'href' => '#'],
                ['id' => 3, 'label' => 'Schools', 'href' => '#'],
            ],
        ],
        [
            'id' => 4,
            'label' => 'Culture',
            'href' => '#',
            'children' => [
                ['id' => 5, 'label' => 'Libraries', 'href' => '#'],
            ],
        ],
    ],
])
@endmegaMenu
