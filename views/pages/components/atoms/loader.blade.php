@extends('layout.containers.doc')

@section('doc-content')
    @markdown
        # Loader
        Displays progress loaders in different shapes.
    @endmarkdown

    @doc(['slug' => 'loader'])
    @enddoc
@stop
