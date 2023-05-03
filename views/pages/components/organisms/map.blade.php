@extends('layout.containers.doc')

@section('doc-content')
    @markdown
        #Map   
    @endmarkdown

    @doc(['slug' => 'map'])
    @enddoc
@stop