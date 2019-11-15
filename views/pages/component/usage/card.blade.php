@card(
    [
        'image' => 'https://picsum.photos/300/200?image=1077',
        'title' => ['text' => 'Another title with a few more words. Two lines of text.', 'position' => 'body'],
        'byline' => ['text' => 'Neglecterino nulecule four krustys flunjer parents', 'position' => 'body'],
        'content' => 'Your content text',
        'buttons' => [
            [
                'href' => 'http://styleguide.helsingborg.se/card',
                'text' => 'Action button 1',
                'attributeList' => ['js-toggle-trigger']
            ],
            [
                'href' => 'http://styleguide.helsingborg.se/card',
                'text' => 'Action button 2',
            ]
        ],
        'icons' => [
            [
                'name' => 'flask',
                'attributeList' => ['js-toggle-trigger'],
                'classList' => ['someClass'],
            ],
            [
                'text' => 'shopping-cart',
                'attributeList' => ['js-toggle-trigger'],
                'classList' => ['someClass'],
            ]
        ]
    ]
)
@endcard