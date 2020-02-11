@extends('layout.containers.doc')

@section('doc-content')
    @markdown
    #Calendar
    @endmarkdown


    @doc(['slug' => 'calendar'])
    @enddoc
@stop