@extends('layout.containers.doc')

@section('doc-content')

    @markdown
        #Form
        Wraps forms
        
    @endmarkdown

    @doc(['slug' => 'form'])
    @enddoc

@stop
