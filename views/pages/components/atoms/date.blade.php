@extends('layout.containers.doc')

@section('doc-content')
    @markdown
        #Date      
    @endmarkdown


    @doc(['slug' => 'date'])
    @enddoc
@stop