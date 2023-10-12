@extends('layout.containers.doc')

@section('doc-content')
    @markdown
        # Paper
        Wraps content inside a container
    @endmarkdown

    @doc(['slug' => 'paper'])
    @enddoc
@stop
