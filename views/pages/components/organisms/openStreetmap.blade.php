@extends('layout.containers.doc')

@section('doc-content')
    @markdown
        #OpenStreetMap   
    @endmarkdown

    @doc(['slug' => 'openstreetmap'])
    @enddoc
@stop