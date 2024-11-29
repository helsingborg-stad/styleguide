@card(
    [
        'avatar' => [
            'name' => 'Snowflake'
        ],
        'image' => 'https://picsum.photos/id/1077/300/200',
        'href' => 'http://styleguide.helsingborg.se/card',
        'title' => [
            'text' => 'Maybe you also need to add some cool icon-buttons',
            'position' => 'top'
        ],
        'byline' => [
            'text' => 'Social icons or something else...',
            'position' => 'body'
        ],
        'content' => 'Brussels sprout coriander water chestnut gourd swiss chard wakame kohlrabi beetroot carrot watercress.
        Corn amaranth salsify bunya nuts nori azuki bean chickweed potato bell pepper artichoke.',
        'classList' => ['c-card--shadow-on-hover'],
        'icons' => [
            [
                'name' => 'favorite',
                'size' => 'lg',
                'attributeList' => ['js-toggle-trigger']
            ],
            [
                'name' => 'forum',
                'size' => 'lg',
                'color' => 'primary',
                'attributeList' => ['js-toggle-trigger']
            ],
            [
                'name' => 'place',
                'size' => 'lg',
                'color' => 'secondary',
                'attributeList' => ['js-toggle-trigger']
            ]
        ],
        'buttons' => [
            [
                'href' => 'http://helsingborg.se',
                'text' => 'Action button 1',
                'attributeList' => ['js-toggle-trigger'],
                'color' => 'primary'
            ],
            [
                'href' => 'http://',
                'text' => 'Action button 2',
                'attributeList' => ['js-toggle-trigger'],
                'color' => 'secondary'
            ]
        ],
        'dropdown' => [
            'direction' => 'top',
            'position' => 'bottom',
            'items' => [
                ['text' => 'Apple', 'link' => '#'],
                ['text' => 'Orange', 'link' => '#'],
                ['text' => 'Pear', 'link' => '#'],
                ['text' => 'Melon', 'link' => '#'],
                ['text' => 'Lemmon', 'link' => '#']
            ]
        ],
        'accordion' =>
        [
            'items' => [
                [
                    'heading' => 'Im a heading for accordion',
                    'content' => 'Brussels sprout coriander water chestnut gourd swiss chard
                    wakame kohlrabi beetroot carrot watercress.'
                ]
            ],
            'classList' => ['c-card--no-accordion']

        ]
    ]
)

@endcard