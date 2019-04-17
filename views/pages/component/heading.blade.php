@extends('layout.master')

@section('content')
    @markdown
        #Headings (Titles etc.)
        A simple heading component. 
    @endmarkdown

    @doc(['slug' => 'heading'])

        @heading([
            'label' => "Headline size 1",
            'level' => 1
        ])
        @endbutton

        @heading([
            'label' => "Headline size 2",
            'level' => 2
        ])
        @endbutton

        @heading([
            'label' => "Headline size 3",
            'level' => 3
        ])
        @endbutton

        @heading([
            'label' => "Headline size 4",
            'level' => 4
        ])
        @endbutton

        @heading([
            'label' => "Headline size 5",
            'level' => 5
        ])
        @endbutton

        @heading([
            'label' => "Headline size 6",
            'level' => 6
        ])
        @endbutton

    @enddoc
@stop
