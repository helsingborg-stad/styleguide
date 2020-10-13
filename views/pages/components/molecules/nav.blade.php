@extends('layout.containers.doc')

@section('doc-content')
    @markdown
        #Navigation
    @endmarkdown

    @doc(['slug' => 'nav'])
    @enddoc
@stop
