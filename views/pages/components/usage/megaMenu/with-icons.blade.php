@button([
    'id' => 'mega-menu-icons-trigger',
    'color' => 'primary',
    'text' => 'Open menu',
    'attributeList' => [
        'data-js-mega-menu-trigger' => 'mega-menu-icons',
    ]
])
@endbutton

@megaMenu([
    'id' => 'mega-menu-icons',
    'menuItems' => [
        [
            'id' => 1,
            'label' => 'City services',
            'href' => '#',
            'icon' => ['icon' => 'home', 'size' => 'sm', 'classList' => []],
            'children' => [
                ['id' => 2, 'label' => 'Permits', 'href' => '#', 'icon' => ['icon' => 'description', 'size' => 'sm', 'classList' => []]],
                ['id' => 3, 'label' => 'Schools', 'href' => '#', 'icon' => ['icon' => 'school', 'size' => 'sm', 'classList' => []]],
            ],
        ],
        [
            'id' => 4,
            'label' => 'Culture',
            'href' => '#',
            'icon' => ['icon' => 'museum', 'size' => 'sm', 'classList' => []],
            'children' => [
                ['id' => 5, 'label' => 'Libraries', 'href' => '#', 'icon' => ['icon' => 'local_library', 'size' => 'sm', 'classList' => []]],
                ['id' => 6, 'label' => 'Events', 'href' => '#', 'icon' => ['icon' => 'event', 'size' => 'sm', 'classList' => []]],
            ],
        ],
    ],
])
@endmegaMenu
