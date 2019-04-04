@extends('layout.master')

@section('content')
    {!!
        markdown('
            #Cards

            Nullam quis risus eget urna mollis ornare vel eu leo. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
        ')
    !!}

    @include('layout.doc', ['markup' => component('card')])

@stop




