@extends('layout.containers.doc')

@section('doc-content')
    @markdown
        #Filter selector
        Displays a select filter.
    @endmarkdown

    @doc(['slug' => 'filterSelect'])
    @enddoc
@stop
