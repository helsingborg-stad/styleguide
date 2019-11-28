@extends('layout.master')

@section('content')

    @markdown
    #Navbar

    Nullam quis risus eget urna mollis ornare vel eu leo. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
    @endmarkdown

    @doc(['slug' => 'navbar', 'displayParams' => false])

        @navbar([
            'logo' => '/assets/img/logotype.svg',
            'logoPosition' => 'left',
            'items' => [
                [
                    'id' => '123',
                    'name' => 'Level 1 1',
                    'href' => '#',
                    'list' => true
                ],
                [
                    'id' => '79699676',
                    'name' => 'Level 2 1',
                    'href' => '#'
                ],
                [
                    'id' => '959656454',
                    'name' => 'Level 3 1',
                    'href' => '#'
                ],
                [
                    'id' => '46346346346123',
                    'name' => 'Level 4 1',
                    'href' => '#'
                ],
            ],
        ])

        @endnavbar
    @enddoc

    @doc(['slug' => 'navbar'])

    @navbar([
        'logo' => 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Helsingborg_vapen.svg/198px-Helsingborg_vapen.svg.png',
        'logoPosition' => 'center',
        'items' => [
            [
                'id' => '123',
                'name' => 'Level 1 1',
                'href' => '#',
                'list' => true
            ],
            [
                'id' => '79699676',
                'name' => 'Level 2 1',
                'href' => '#'
            ],
            [
                'id' => '959656454',
                'name' => 'Level 3 1',
                'href' => '#'
            ],
            [
                'id' => '46346346346123',
                'name' => 'Level 4 1',
                'href' => '#'
            ],
        ]
    ])

    @endnavbar
    @enddoc

@stop




