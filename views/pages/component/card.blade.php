@extends('layout.master')

@section('content')
    
    {!!
        markdown('
            #Cards

            Nullam quis risus eget urna mollis ornare vel eu leo. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
        ')
    !!}


    @doc(['slug' => 'card'])

        @card()

            @slot('title')
                Hej! 
            @endslot

        @endcard

    @enddoc
    

@stop




