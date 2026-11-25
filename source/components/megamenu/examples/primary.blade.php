<div class="u-position--relative">
    @megaMenu([
        'id' => 'megamenu-primary',
        'classList' => ['c-megamenu--primary', 'c-megamenu--font-heading'],
        'menuItems' => [
        [
            'id' => 'work',
            'label' => 'Arbete',
            'href' => '#',
            'description' => 'Lediga jobb, praktik och feriearbete.',
            'icon' => ['icon' => 'work', 'size' => 'md', 'classList' => []],
            'children' => [
                ['id' => 'work-1', 'label' => 'Lediga jobb', 'href' => '#', 'icon' => ['icon' => '', 'size' => 'sm', 'classList' => []]],
                ['id' => 'work-2', 'label' => 'Feriearbete', 'href' => '#', 'icon' => ['icon' => '', 'size' => 'sm', 'classList' => []]],
                ['id' => 'work-3', 'label' => 'Praktik', 'href' => '#', 'icon' => ['icon' => '', 'size' => 'sm', 'classList' => []]],
            ],
        ],
        [
            'id' => 'living',
            'label' => 'Bo och bygga',
            'href' => '#',
            'active' => true,
            'description' => 'Bygglov, boende och stadsplanering.',
            'icon' => ['icon' => 'home', 'size' => 'md', 'classList' => []],
            'children' => [
                ['id' => 'living-1', 'label' => 'Bygglov', 'href' => '#', 'active' => true, 'icon' => ['icon' => '', 'size' => 'sm', 'classList' => []]],
                ['id' => 'living-2', 'label' => 'Detaljplaner', 'href' => '#', 'icon' => ['icon' => '', 'size' => 'sm', 'classList' => []]],
                ['id' => 'living-3', 'label' => 'Bostäder', 'href' => '#', 'icon' => ['icon' => '', 'size' => 'sm', 'classList' => []]],
            ],
        ],
        [
            'id' => 'school',
            'label' => 'Förskola och utbildning',
            'href' => '#',
            'description' => 'Förskola, grundskola och vuxenutbildning.',
            'icon' => ['icon' => 'school', 'size' => 'md', 'classList' => []],
            'children' => [
                ['id' => 'school-1', 'label' => 'Förskola', 'href' => '#', 'icon' => ['icon' => '', 'size' => 'sm', 'classList' => []]],
                ['id' => 'school-2', 'label' => 'Grundskola', 'href' => '#', 'icon' => ['icon' => '', 'size' => 'sm', 'classList' => []]],
                ['id' => 'school-3', 'label' => 'Vuxenutbildning', 'href' => '#', 'icon' => ['icon' => '', 'size' => 'sm', 'classList' => []]],
            ],
        ],
        [
            'id' => 'care',
            'label' => 'Omsorg och stöd',
            'href' => '#',
            'description' => 'Äldreomsorg, funktionsstöd och ekonomiskt stöd.',
            'icon' => ['icon' => 'favorite', 'size' => 'md', 'classList' => []],
            'children' => [
                ['id' => 'care-1', 'label' => 'Äldreomsorg', 'href' => '#', 'icon' => ['icon' => '', 'size' => 'sm', 'classList' => []]],
                ['id' => 'care-2', 'label' => 'Funktionsstöd', 'href' => '#', 'icon' => ['icon' => '', 'size' => 'sm', 'classList' => []]],
                ['id' => 'care-3', 'label' => 'Ekonomiskt bistånd', 'href' => '#', 'icon' => ['icon' => '', 'size' => 'sm', 'classList' => []]],
            ],
        ],
    ],
    ])
    @endmegaMenu
</div>
<div style="height: 400px;"></div><!-- Padder -->
