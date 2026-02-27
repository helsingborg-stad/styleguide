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
            "icon" => "work",
            "ancestor" => true
        ],
        "aktuellt" => [
            "label" => "Aktuellt",
            "href" => "#",
            "icon" => "article",
            "active" => true
        ],
        "kontakt" => [
            "label" => "Kontakt",
            "href" => "#",
            "icon" => "mail"
        ]
    ],
    'classList' => ['u-position--relative', 'c-navbar--border-top']
])
@endnavbar
