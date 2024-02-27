@extends('layout.containers.doc')

@section('doc-content')
    @markdown
        #Quote
        Displays a quote
    @endmarkdown

    @doc(['slug' => 'quote'])
    @enddoc
@stop