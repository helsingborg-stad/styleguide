@extends('layout.containers.doc')

@section('doc-content')
    @markdown
        #Dividers
    @endmarkdown


    @doc(['slug' => 'divider'])
    @enddoc
@stop