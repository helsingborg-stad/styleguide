@extends('layout.containers.doc')

@section('doc-content')
    @markdown
        #Map   
    @endmarkdown

    @doc(['slug' => '_openstreetmap'])
    @enddoc
@stop