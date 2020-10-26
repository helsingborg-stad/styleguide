@extends('layout.containers.doc')

@section('doc-content')
    @markdown
        #Nav
    @endmarkdown

    @doc(['slug' => 'nav'])
    @enddoc
@stop
