@extends('layout.master')

@section('hero')
    @hero([
        'complementaryImage' => '/assets/img/isometric.png',
        'backgroundColor' => '#444e71',
        'headline' => 'Helsingborg Stad', 
        'byline' => 'Styleguide - Version 2.0', 
        'gradientColor' => 'light',
        'brandSymbol' => BASEPATH . '/assets/img/brand.svg'
    ])

    @slot('content')
        The Helsingborg Styleguide is a flexible and minimalistic component-based framework built in the BEM standard. 
    @endslot

    @endhero
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
        <div class="grid-xs-12 grid-md-4">
            @card([
                'href' => '/about/accessibility',
                'image' => 'https://picsum.photos/300/225?image=919',
                'title' => ['text' => 'Usability', 'position' => 'top'],
                'byline' => ['text' => 'A web for everyone', 'position' => 'top'],
                'classList' => ['c-card--shadow-on-hover'],
                'content' => 'One of the main focus of this styleguide is usability. Read more of our guidelines here.',
                'hasRipple' => false
            ])

            @endcard
        </div>

        <div class="grid-xs-12 grid-md-4">
            @card([
                'href' => '/about/styleguide-structure',
                'image' => 'https://picsum.photos/300/225?image=743',
                'title' => ['text' => 'Blade components', 'position' => 'top'],
                'byline' => ['text' => 'A wide variaty of components', 'position' => 'top'],
                'classList' => ['c-card--shadow-on-hover'],
                'content' => 'This styleguide is in many parts crated with our own blade component library to enable swift development and maintaince.',
                'hasRipple' => false
            ])

            @endcard
        </div>

        <div class="grid-xs-12 grid-md-4">
            @card([
                'href' => '/about/styleguide-structure',
                'image' => 'https://picsum.photos/300/225?image=455',
                'title' => ['text' => 'Authors', 'position' => 'top'],
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
