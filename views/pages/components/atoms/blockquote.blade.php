@extends('layout.containers.doc')

@section('doc-content')
    @markdown
        #Blockquote      
    @endmarkdown

    @doc(['slug' => 'blockquote'])
    @enddoc
@stop