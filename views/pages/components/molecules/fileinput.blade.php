@extends('layout.containers.doc')

@section('doc-content')
    @markdown
        #File input
        Displays a file input.
    @endmarkdown

    @doc(['slug' => 'fileinput'])
    @enddoc
@stop
