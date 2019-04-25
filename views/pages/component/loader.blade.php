@extends('layout.master')

@section('content')
    @markdown
        # Loader
        Displays progress loaders in different shapes.
    @endmarkdown

    @doc(['slug' => 'loader'])
        @loader(['shape' => 'circular', 'size' => 'md'])
        @endloader

        @loader(['shape' => 'linear'])
        @endloader
    @enddoc
@stop
