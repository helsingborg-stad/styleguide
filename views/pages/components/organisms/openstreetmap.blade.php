@extends('layout.containers.doc')

@section('doc-content')
    @markdown
        #Map   
    @endmarkdown

    @doc(['slug' => 'openstreetmap'])
    @enddoc
@stop