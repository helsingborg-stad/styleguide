@extends('layout.master')

@section('hero')
    @hero([
        'backgroundColor' => '#fff',
        'headline' => 'About this styleguide', 
        'byline' => 'What about [x]?', 
        'textColor' => 'dark'
    ])

    @slot('content')
        Collected thoughts an decitions about how to use the styleguide. 
    @endslot

    @endhero
@endsection

@section('content')
    {!! markdown("

    #About

    This styleguide 

    ##Getting started

    You can easily get started by including our CSS and JavaScript from our GitHub CDN. For the advanced user who wants to customize our code, please refer to the source files in our styleguide at https://github.com/helsingborg-stad/styleguide .

    ") !!}
@stop
