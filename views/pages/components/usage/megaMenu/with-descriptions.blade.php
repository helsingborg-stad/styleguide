@button([
    'id' => 'mega-menu-desc-trigger',
    'color' => 'primary',
    'text' => 'Open menu',
    'attributeList' => [
        'data-js-mega-menu-trigger' => 'mega-menu-desc',
    ]
])
@endbutton

@megaMenu([
    'id' => 'mega-menu-desc',
    'menuItems' => [
        [
            'id' => 1,
            'label' => 'City services',
            'href' => '#',
            'description' => 'Find all services offered by the municipality.',
            'children' => [
                ['id' => 2, 'label' => 'Permits', 'href' => '#'],
                ['id' => 3, 'label' => 'Schools', 'href' => '#'],
            ],
        ],
        [
            'id' => 4,
            'label' => 'Culture & leisure',
            'href' => '#',
            'description' => 'Activities, events and places to visit.',
            'children' => [
                ['id' => 5, 'label' => 'Libraries', 'href' => '#'],
                ['id' => 6, 'label' => 'Sports', 'href' => '#'],
            ],
        ],
    ],
])
@endmegaMenu
