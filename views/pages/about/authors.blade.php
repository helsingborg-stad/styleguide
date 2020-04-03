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
                'heading' => 'Sebastian Thulin',
                'subHeading' => 'Lead developer',
                'image' => ['src' => 'https://avatars0.githubusercontent.com/u/797129?s=460&v=4', 'alt' => 'ALT'],
                'imageFirst' => true,
                'buttons' => [
                    ['type' => 'filled', 'color' => 'primary', 'text' => 'Github', 'href' => 'https://github.com/sebastianthulin']
                ]
            ])
            @endcard
        </div>

        <div class="grid-sm-4">
            @card([
                'heading' => 'Johan Silvergrund',
                'subHeading' => 'Lead developer',
                'image' => ['src' => 'https://avatars1.githubusercontent.com/u/4200504?s=460&v=4', 'alt' => 'ALT'],
                'imageFirst' => true,
                'buttons' => [
                    ['type' => 'filled', 'color' => 'primary', 'text' => 'Github', 'href' => 'https://github.com/silvergrund']
                ]
            ])
            @endcard
        </div>

        <div class="grid-sm-4">
            @card([
                'heading' => 'Alexander Boman Skoug',
                'subHeading' => 'Developer',
                'image' => ['src' => 'https://avatars2.githubusercontent.com/u/39676080?s=460&v=4', 'alt' => 'ALT'],
                'imageFirst' => true,
                'buttons' => [
                    ['type' => 'filled', 'color' => 'primary', 'text' => 'Github', 'href' => 'https://github.com/alexanderbomanskoug2']
                ]
            ])
            @endcard
        </div>

        <div class="grid-sm-4">
            @card([
                'heading' => 'Eric Rosenborg',
                'subHeading' => 'Developer',
                'image' => ['src' => 'https://avatars2.githubusercontent.com/u/11438804?s=460&v=4', 'alt' => 'ALT'],
                'imageFirst' => true,
                'buttons' => [
                    ['type' => 'filled', 'color' => 'primary', 'text' => 'Github', 'href' => 'https://github.com/Muckbuck']
                ]
            ])
            @endcard
        </div>

        <div class="grid-sm-4">
            @card([
                'heading' => 'Jonatan Hansson',
                'subHeading' => 'Developer',
                'image' => ['src' => 'https://avatars3.githubusercontent.com/u/21363149?s=460&v=4', 'alt' => 'ALT'],
                'imageFirst' => true,
                'buttons' => [
                    ['type' => 'filled', 'color' => 'primary', 'text' => 'Github', 'href' => 'https://github.com/jonatanhanson']
                ]
            ])
            @endcard
        </div>

        <div class="grid-sm-4">
            @card([
                'heading' => 'Nikolas Ramstedt',
                'subHeading' => 'Developer',
                'image' => ['src' => 'https://avatars1.githubusercontent.com/u/16800993?s=460&v=4', 'alt' => 'ALT'],
                'imageFirst' => true,
                'buttons' => [
                    ['type' => 'filled', 'color' => 'primary', 'text' => 'Github', 'href' => 'https://github.com/nRamstedt']
                ]
            ])
            @endcard
        </div>

    </div>

</article>
@stop
