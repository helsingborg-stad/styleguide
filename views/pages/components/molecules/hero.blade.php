@extends('layout.containers.doc')

@section('doc-content')
    @markdown
        #Accordion
    @endmarkdown

    @doc(['slug' => 'hero'])
    @enddoc
@stop
