@extends('layout.containers.doc')

@section('doc-content')
    @markdown
        #Acceptance
    @endmarkdown

    @doc(['slug' => 'acceptance'])
    @enddoc
@stop
