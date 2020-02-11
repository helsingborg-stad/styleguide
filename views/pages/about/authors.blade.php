@extends('layout.containers.home')

@section('home-content')
<article>

    {!! markdown("

        #Authors

        These are the authors behind this styleguide. 

    ") !!}

    <div class="grid">

        <div class="grid-sm-4">

            @card([
                'href' => 'https://github.com/sebastianthulin',
                'title' => ['text' => 'Sebastian Thulin', 'position' => 'top'],
                'byline' => ['text' => 'Lead developer', 'position' => 'top'],
                'hasRipple' => false,
                'avatar' => [
                    'image' => 'https://avatars0.githubusercontent.com/u/797129?s=460&v=4',
                    'name' => 'Cookie Monster'
                ]
            ])
            @endcard

        </div>

        <div class="grid-sm-4">


            @card([
                'href' => 'https://github.com/silvergrund',
                'title' => ['text' => 'Johan Silvergrund', 'position' => 'top'],
                'byline' => ['text' => 'Lead developer', 'position' => 'top'],
                'hasRipple' => false,
                'avatar' => [
                    'image' => 'https://avatars1.githubusercontent.com/u/4200504?s=460&v=4',
                    'name' => 'Cookie Monster'
                ]
            ])
            @endcard

        </div>

        <div class="grid-sm-4">


            @card([
                'href' => 'https://github.com/alexanderbomanskoug2',
                'title' => ['text' => 'Alexander Boman Skoug', 'position' => 'top'],
                'byline' => ['text' => 'Developer', 'position' => 'top'],
                'hasRipple' => false,
                'avatar' => [
                    'image' => 'https://avatars2.githubusercontent.com/u/39676080?s=460&v=4',
                    'name' => 'Cookie Monster'
                ]
            ])
            @endcard


        </div>

        <div class="grid-sm-4">

            @card([
                'href' => 'https://github.com/Muckbuck',
                'title' => ['text' => 'Eric Rosenborg', 'position' => 'top'],
                'byline' => ['text' => 'Developer', 'position' => 'top'],
                'hasRipple' => false,
                'avatar' => [
                    'image' => 'https://avatars2.githubusercontent.com/u/11438804?s=460&v=4',
                    'name' => 'Cookie Monster'
                ]
            ])
            @endcard

        </div>

        <div class="grid-sm-4">

            @card([
                'href' => 'https://github.com/jonatanhanson',
                'title' => ['text' => 'Jonatan Hansson', 'position' => 'top'],
                'byline' => ['text' => 'Developer', 'position' => 'top'],
                'hasRipple' => false,
                'avatar' => [
                    'image' => 'https://avatars3.githubusercontent.com/u/21363149?s=460&v=4',
                    'name' => 'Cookie Monster'
                ]
            ])
            @endcard

        </div>

        <div class="grid-sm-4">

            @card([
                'href' => 'https://github.com/nRamstedt',
                'title' => ['text' => 'Nikolas Ramstedt', 'position' => 'top'],
                'byline' => ['text' => 'Developer', 'position' => 'top'],
                'hasRipple' => false,
                'avatar' => [
                    'image' => 'https://avatars1.githubusercontent.com/u/16800993?s=460&v=4',
                    'name' => 'Cookie Monster'
                ]
            ])
            @endcard

        </div>

    </div>

</article>
@stop
