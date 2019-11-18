@extends('layout.master')

@section('content')

    @markdown
    #Navbar

    Nullam quis risus eget urna mollis ornare vel eu leo. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
    @endmarkdown

    @doc(['slug' => 'navbar', 'displayParams' => false])

        @navbar([
            'logo' => 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Helsingborg_vapen.svg/198px-Helsingborg_vapen.svg.png',
            'logoPosition' => 'left',
            'itemsPosition' => 'left',
            'items' => [
                'Level 1 1' => [
                    'href' => '#',
                    'list' => [
                        'Level 2 1' => [
                            'href' => '#',
                            'list' => [
                                'Level 3 1' => [
                                    'href' => '#'
                                ]
                            ]
                        ],
                        'Level 2 2' => [
                            'href' => '#'
                        ]
                    ]
                ],
                'Level 1 2' => [
                    'href' => '#'
                ]
                ,
                'Level 1 3' => [
                    'href' => '#'
                ],
                'Level 1 4' => [
                    'href' => '#'
                ]
            ],
            'classList' => [
                'u-color__bg--danger'
            ]
        ])

        @endnavbar
    @enddoc

    @doc(['slug' => 'navbar'])

    @navbar([
        'logo' => 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Helsingborg_vapen.svg/198px-Helsingborg_vapen.svg.png',
        'logoPosition' => 'center',
        'items' => [
            'Level 1 1' => [
                'href' => '#',
                'list' => [
                    'Level 2 1' => [
                    'href' => '#',
                    'list' => [
                        'Level 3 1' => [
                            'href' => '#'
                        ]
                    ]
                ],
                'Level 2 2' => [
                    'href' => '#'
                ]
            ]
        ],
        'Level 1 2' => [
            'href' => '#'
        ]
        ,
        'Level 1 3' => [
            'href' => '#'
        ],
        'Level 1 4' => [
            'href' => '#'
        ]
        ],
        'classList' => [
            'u-color__bg--danger'
        ]
    ])

    @endnavbar
    @enddoc

@stop




