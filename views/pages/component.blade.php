@extends('layout.master')

@section('hero')
    @hero([
        'backgroundColor' => '#fff',
        'headline' => 'Components', 
        'byline' => 'Independent views', 
        'textColor' => 'dark',
    ])

    @slot('content')
        A component is a independent functional view. They can accept multiple attributes as an array and acts accordiongly without writing a single row of markup, if you don't want to. 
    @endslot

    @endhero
@endsection

@section('content')
    @markdown
        #Components
        The component library is a collection of robust views with builtin logic to handle common scenarios. 

        ##Why use components? 
        The basic purpose of the component library is that they allows third party developer to manipulate data before it enters the view. 

        This simple concept makes it a powerful tool to manipulate display of content without to touch a single line of html. And hey, if thay want to they can replace both controllers and views to make deep customizations.
    @endmarkdown
@stop
