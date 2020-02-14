@extends('layout.containers.doc')

@section('doc-content')
    @markdown
        #Code      
    @endmarkdown


    @doc(['slug' => 'code'])
    @enddoc
@stop