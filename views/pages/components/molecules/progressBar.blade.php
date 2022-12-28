@extends('layout.containers.doc')

@section('doc-content')
    @markdown
    #Progress bar 
    @endmarkdown

    @doc(['slug' => 'progressbar'])
    @enddoc
@stop
