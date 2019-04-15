@extends('layout.master')

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
                'image' => 'https://picsum.photos/300/200?image=919',
                'title' => 'Usability', 
                'content' => 'On of the main focus of this styleguide is usability. Read more of our guidelines here.'
            ])
        </div>

        <div class="grid-xs-12 grid-md-4">
            @card([
                'image' => 'https://picsum.photos/300/200?image=743',
                'title' => 'Blade components', 
                'content' => 'This styleguide is in many parts crated with our own blade component library to enable swift development and maintaince.'
            ])
        </div>

        <div class="grid-xs-12 grid-md-4">
            @card([
                'image' => 'https://picsum.photos/300/200?image=455',
                'title' => 'Authors', 
                'content' => 'The styleguide and lirbraries where created by the awesome development team @ helsingborg stad.'
            ])
        </div>

    </div>

</article>
@stop
