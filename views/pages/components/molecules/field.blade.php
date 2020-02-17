@extends('layout.containers.doc')

@section('doc-content')

    @markdown
        #Field
        Displays different type of form fields.
    @endmarkdown

    @doc(['slug' => 'field'])
    @enddoc

@stop
