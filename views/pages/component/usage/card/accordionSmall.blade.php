@card([
    'image' => 'https://picsum.photos/300/200?image=1078',
    'title' => [
        'text' => 'Sometimes its better to hide data',
        'position' => 'body'
    ],
    'byline' => [
        'text' => 'Why not in an accordion',
        'position' => 'body'
    ],
    'hasRipple' => false,
    'dark_background' => false,
    'accordion' => [
        'items' => [
            [
            'heading' => 'Click on me for more info.',
            'content' => 'Brussels sprout coriander water chestnut gourd swiss chard
            wakame kohlrabi beetroot carrot watercress.'
            ]
        ],
        'classList' => ['c-card--no-accordion']
    ]
])

@endcard