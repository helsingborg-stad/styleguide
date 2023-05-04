@extends('layout.containers.doc')

@section('doc-content')
    @markdown
        #Open Street Map
    @endmarkdown

    @doc(['slug' => 'openStreetMap'])
    @enddoc
@stop
