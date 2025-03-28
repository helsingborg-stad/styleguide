@extends('layout.containers.doc')

@section('doc-content')
    @markdown
        #IconSection
    @endmarkdown

    @doc(['slug' => 'iconSection'])
    @enddoc
@stop
