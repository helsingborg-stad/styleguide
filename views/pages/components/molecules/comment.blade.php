@extends('layout.containers.doc')

@section('doc-content')
    @markdown
        #Comment      
    @endmarkdown


    @doc(['slug' => 'comment'])
    @enddoc
@stop