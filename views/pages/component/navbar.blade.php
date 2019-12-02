@extends('layout.master')

@section('content')

    @markdown
    #Navbar

    Nullam quis risus eget urna mollis ornare vel eu leo. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
    @endmarkdown

    @doc(['slug' => 'navbar', 'displayParams' => false])
        @markdown
            ### Default Navbar
        @endmarkdown

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
            'topAccent' => 'primary',
            'activeAccent' => 'primary'
        ])

        @endnavbar
    @enddoc

    @doc(['slug' => 'navbar', 'displayParams' => false])
        @markdown
            ### Logo position left
        @endmarkdown
        
        @navbar([
            'logo' => '/assets/img/logotype.svg',
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
            'topAccent' => 'primary',
            'activeAccent' => 'primary'
        ])

        @endnavbar

        @markdown
        ### Logo position left, Item position right
        @endmarkdown

        @navbar([
            'logo' => '/assets/img/logotype.svg',
            'logoPosition' => 'left',
            'linksPosition' => 'right',
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
            'topAccent' => 'primary',
            'activeAccent' => 'primary'
        ])

        @endnavbar
    @enddoc

    @doc(['slug' => 'navbar', 'displayParams' => false])
        @markdown
            #### Logo position right
        @endmarkdown
        
        @navbar([
            'logo' => '/assets/img/logotype.svg',
            'logoPosition' => 'right',
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
            'topAccent' => 'primary',
            'activeAccent' => 'primary'
        ])

        @endnavbar

        @markdown
            #### Logo position right, Item position left
        @endmarkdown

        @navbar([
            'logo' => '/assets/img/logotype.svg',
            'logoPosition' => 'right',
            'linksPosition' => 'left',
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
            'topAccent' => 'primary',
            'activeAccent' => 'primary'
        ])

        @endnavbar
    @enddoc

    @doc(['slug' => 'navbar'])
        @markdown
            ### Logo position center
        @endmarkdown

        @navbar([
            'logo' => '/assets/img/brand-red.svg',
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
            ],
            'topAccent' => 'primary'
        ])

        @endnavbar

        @markdown
        ### Logo position top
        @endmarkdown
        
        @navbar([
            'logo' => '/assets/img/logotype.svg',
            'logoPosition' => 'top',
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
            'topAccent' => 'primary',
            'activeAccent' => 'primary'
        ])

        @endnavbar
    @enddoc

@stop




