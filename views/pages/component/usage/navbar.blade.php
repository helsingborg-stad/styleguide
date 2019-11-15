//Navbar
@navbar([
    'logo' => 'https://www.url.image.png',
    'logoPosition' => 'left',
    'itemsPosition' => 'right',
    'items' => [
        'Item 1' => [
            'href' => '/item1',
            'list' => [
                'Subitem 1' => [
                    'href' => '/item1/subitem1',
                ],
                'Subitem 2' => [
                    'href' => '/item1/subitem2'
                    'list' => [
                        'Sub-Subitem 2' => [
                            'href' => '/item1/subitem2/sub'
                        ]
                    ]
                ]
            ],
        ],
        
        'Item 2' => [
            'href' => '/item2'
        ],

        'Item 3' => [
            'href' => '/item3'
        ],

        'item 4' => [
            'href' => '/item4'
        ]
    ]
])
@endnavbar