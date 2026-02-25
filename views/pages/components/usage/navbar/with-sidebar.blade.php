@navbar([
    'logo' => '/assets/img/logotype.svg',
    'items' => [
        "start" => [
            "label" => "Start",
            "href" => "#",
            "icon" => "home"
        ],
        "tjanster" => [
            "label" => "Tjänster",
            "href" => "#",
            "icon" => "work"
        ],
        "kontakt" => [
            "label" => "Kontakt",
            "href" => "#",
            "icon" => "mail"
        ]
    ],
    'sidebar' => ['trigger' => 'main-sidebar'],
    'classList' => ['u-position--relative', 'c-navbar--border-top']
])
@endnavbar
