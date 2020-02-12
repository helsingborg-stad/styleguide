@extends('layout.containers.doc')

@section('doc-content')
    @markdown
        #Image      
    @endmarkdown


    @doc(['slug' => 'image'])
    @enddoc
@stop

