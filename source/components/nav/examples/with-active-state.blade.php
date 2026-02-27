@nav([
    'items' => [
        [
            'href' => '#',
            'label' => 'Arbete',
            'ancestor' => true,
            'children' => [
                [
                    'href' => '#',
                    'label' => 'Platsbanken',
                    'active' => true,
                    'children' => false,
                ],
                [
                    'href' => '#',
                    'label' => 'Starta företag',
                    'children' => false,
                ],
            ],
        ],
        [
            'href' => '#',
            'label' => 'Bo och bygga',
            'children' => false,
        ],
        [
            'href' => '#',
            'label' => 'Förskola och utbildning',
            'children' => false,
        ],
        [
            'href' => '#',
            'label' => 'Omsorg och stöd',
            'children' => false,
        ],
    ],
    'classList' => ['u-position--relative', 'c-nav--bordered'],
    'direction' => 'vertical',
    'includeToggle' => true,
])
@endnav
