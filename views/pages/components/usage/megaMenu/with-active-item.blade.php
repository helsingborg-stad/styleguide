@button([
    'id' => 'mega-menu-active-trigger',
    'color' => 'primary',
    'text' => 'Open menu',
    'attributeList' => [
        'data-js-mega-menu-trigger' => 'mega-menu-active',
    ]
])
@endbutton

@megaMenu([
    'id' => 'mega-menu-active',
    'menuItems' => [
        [
            'id' => 1,
            'label' => 'City services',
            'href' => '#',
            'active' => true,
            'children' => [
                ['id' => 2, 'label' => 'Permits', 'href' => '#', 'active' => true],
                ['id' => 3, 'label' => 'Schools', 'href' => '#'],
            ],
        ],
        [
            'id' => 4,
            'label' => 'Culture',
            'href' => '#',
            'children' => [
                ['id' => 5, 'label' => 'Libraries', 'href' => '#'],
                ['id' => 6, 'label' => 'Events', 'href' => '#'],
            ],
        ],
    ],
])
@endmegaMenu
