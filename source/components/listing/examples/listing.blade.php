@listing(
    [
    'list' => [
            ['label' => 'This is a list label for item 1'],
            ['label' => 'This is a list label for item 2'],
            ['href' => 'https://url-to-item.io', 'label' => 'This is a list label for item 3 with a link'],
            ['href' => 'https://getmunicipio.com',
            'label' => 'Hey, Look I have kiddos!',
            'childrenElementType' => "ul",
            'children' => [
                [
                    'href' => 'http://styleguide.getmunicipio.com/',
                    'label' => 'I am sub label',
                ],
                [
                    'label' => 'I am another sub label 1',
                ],
                [
                    'label' => 'I am another sub label 2',
                ],
                [
                    'label' => 'Here you go, a list in a list in a list',
                    'children' => [
                        ['label' => 'I am another sub sub label 1'],
                        ['label' => 'I am another sub sub label 2'],
                        ['label' => 'I am another sub sub label 3'],
                        ['label' => 'I am another sub sub label 4'],
                        ['label' => 'I am another sub sub label 5'],
                        ['label' => 'The list can go on and on and on and on....'],
                    ]
                ]
            ]
        ],
    ],
    'elementType' => "ol"
    ]
)
@endlisting