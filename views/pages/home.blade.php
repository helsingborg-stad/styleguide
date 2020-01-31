@extends('layout.master')

@section('hero')
    @segment([
        'template' => 'full',
        'height' => 'md',
        'parallax' => true,
        'background_color' => '#E5E5E5',
        'content_alignment' => [
            'vertical' => 'center',
            'horizontal' => 'center'
        ],
        'heading' => "Domesticas me nisi, noctis, comminiscebatur per eventu pede 2 sed nam felis.",
        'body' => "Impedimenta dextre etiam 250 magnae cum, novembris e optio sem recordationem quasi communis.",
        'cta' => [
            [

                'type' => 'filled',
                'color' => 'primary',
                'text' => 'Read More',
                'size' => 'lg'
            ],
            [
                'type' => 'filled',
                'color' => 'primary',
                'text' => 'Apply',
                'size' => 'lg'
            ]
        ],
        'classList' => [
            'p-home__hero'
        ]

    ])

    @endsegment
@endsection


@section('content')
<article>

    {!! markdown("

        #Helsingborg Stad - Styleguide [V2]

        Welcome to the online style guide intended for websites within Helsingborgs stad and others who use our platform. The guide provides examples, markup and themes for our standardized components.

        ##Getting started

        You can easily get started by including our CSS and JavaScript from our GitHub CDN. For the advanced user who wants to customize our code, please refer to the source files in our styleguide at https://github.com/helsingborg-stad/styleguide .

    ") !!}

    <div class="grid" data-equal-container>
        <div class="grid-xs-12 grid-md-3">
            @card([
                'href' => '/about/accessibility',
                'image' => '/assets/img/component.svg',
                'title' => ['text' => 'Components', 'position' => 'body'],
                'byline' => ['text' => 'A web for everyone', 'position' => 'top'],
                'classList' => ['c-card--shadow-on-hover'],
                'content' => 'One of the main focus of this styleguide is usability. Read more of our guidelines here.',
                'hasRipple' => false
            ])

            @endcard
        </div>

        <div class="grid-xs-12 grid-md-3">
            @card([
                'href' => '/about/styleguide-structure',
                'image' => '/assets/img/atom.svg',
                'title' => ['text' => 'Atomic Design', 'position' => 'body'],
                'byline' => ['text' => 'A wide variaty of components', 'position' => 'top'],
                'classList' => ['c-card--shadow-on-hover'],
                'content' => 'This styleguide is in many parts crated with our own blade component library to enable swift development and maintaince.',
                'hasRipple' => false
            ])

            @endcard
        </div>

        <div class="grid-xs-12 grid-md-3">
            @card([
                'href' => '/about/styleguide-structure',
                'image' => '/assets/img/utility.svg',
                'title' => ['text' => 'Utilities', 'position' => 'body'],
                'byline' => ['text' => 'Behind the screen', 'position' => 'top'],
                'classList' => ['c-card--shadow-on-hover'],
                'content' => 'The styleguide and lirbraries where created by the awesome development team @ helsingborg stad.',
                'hasRipple' => false
            ])

            @endcard
        </div>
        <div class="grid-xs-12 grid-md-3">
            @card([
                'href' => '/about/styleguide-structure',
                'image' => '/assets/img/usability.svg',
                'title' => ['text' => 'Usability', 'position' => 'body'],
                'byline' => ['text' => 'Behind the screen', 'position' => 'top'],
                'classList' => ['c-card--shadow-on-hover'],
                'content' => 'The styleguide and lirbraries where created by the awesome development team @ helsingborg stad.',
                'hasRipple' => false
            ])

            @endcard
        </div>

    </div>

</article>
@stop
