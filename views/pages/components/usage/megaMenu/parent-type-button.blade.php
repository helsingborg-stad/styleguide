@button([
    'id' => 'mega-menu-parent-btn-trigger',
    'color' => 'primary',
    'text' => 'Open menu',
    'attributeList' => [
        'data-js-mega-menu-trigger' => 'mega-menu-parent-btn',
    ]
])
@endbutton

@megaMenu([
    'id' => 'mega-menu-parent-btn',
    'parentType' => 'button',
    'parentStyle' => 'filled',
    'parentStyleColor' => 'primary',
    'menuItems' => [
        [
            'id' => 1,
            'label' => 'City services',
            'href' => '#',
            'icon' => ['icon' => 'home', 'size' => 'sm', 'classList' => []],
            'children' => [
                ['id' => 2, 'label' => 'Permits', 'href' => '#'],
                ['id' => 3, 'label' => 'Schools', 'href' => '#'],
            ],
        ],
        [
            'id' => 4,
            'label' => 'Culture',
            'href' => '#',
            'icon' => ['icon' => 'museum', 'size' => 'sm', 'classList' => []],
            'children' => [
                ['id' => 5, 'label' => 'Libraries', 'href' => '#'],
                ['id' => 6, 'label' => 'Events', 'href' => '#'],
            ],
        ],
    ],
])
@endmegaMenu
