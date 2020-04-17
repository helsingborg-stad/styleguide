@navbar([
    'logo' => '/assets/img/logotype.svg',
    'items' => [
        "about" => [
            "label" => "About",
            "href" => "#",
            "icon" => "people",
            "id" => 1
        ],
        "stuff" => [
            "label" => "Stuff",
            "href" => "#",
            "icon" => "people",
            "id" => 2
        ],
        "more" => [
            "label" => "More",
            "href" => "#",
            "icon" => "people",
            "id" => 3
        ]
    ],
    'expanded_prev' => 'Hem',
    'expanded_current' => 'Bidrag och Underhåll',
    'expanded_menu' => $topNavItems,
    'classList' => ['u-position--relative'],
    'childItemsUrl' => '/'
])

@endnavbar