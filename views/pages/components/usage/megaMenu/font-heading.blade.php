@button([
    'id' => 'mega-menu-font-trigger',
    'color' => 'primary',
    'text' => 'Open menu',
    'attributeList' => [
        'data-js-mega-menu-trigger' => 'mega-menu-font',
    ]
])
@endbutton

@megaMenu([
    'id' => 'mega-menu-font',
    'classList' => ['c-megamenu--font-heading'],
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
                ['id' => 6, 'label' => 'Events', 'href' => '#'],
            ],
        ],
    ],
])
@endmegaMenu
