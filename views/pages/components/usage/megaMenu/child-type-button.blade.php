@button([
    'id' => 'mega-menu-child-btn-trigger',
    'color' => 'primary',
    'text' => 'Open menu',
    'attributeList' => [
        'data-js-mega-menu-trigger' => 'mega-menu-child-btn',
    ]
])
@endbutton

@megaMenu([
    'id' => 'mega-menu-child-btn',
    'childType' => 'button',
    'childStyle' => 'filled',
    'childStyleColor' => 'primary',
    'menuItems' => [
        [
            'id' => 1,
            'label' => 'City services',
            'href' => '#',
            'children' => [
                ['id' => 2, 'label' => 'Permits', 'href' => '#', 'icon' => ['icon' => 'description', 'size' => 'sm', 'classList' => []]],
                ['id' => 3, 'label' => 'Schools', 'href' => '#', 'icon' => ['icon' => 'school', 'size' => 'sm', 'classList' => []]],
            ],
        ],
        [
            'id' => 4,
            'label' => 'Culture',
            'href' => '#',
            'children' => [
                ['id' => 5, 'label' => 'Libraries', 'href' => '#', 'icon' => ['icon' => 'local_library', 'size' => 'sm', 'classList' => []]],
                ['id' => 6, 'label' => 'Events', 'href' => '#', 'icon' => ['icon' => 'event', 'size' => 'sm', 'classList' => []]],
            ],
        ],
    ],
])
@endmegaMenu
