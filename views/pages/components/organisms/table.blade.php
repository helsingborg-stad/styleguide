@extends('layout.containers.doc')

@section('doc-content')
    @markdown
        #Table
    @endmarkdown

    @doc(['slug' => 'table'])
    @enddoc
@stop



