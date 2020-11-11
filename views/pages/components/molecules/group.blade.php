@extends('layout.containers.doc')

@section('doc-content')
    @markdown
        #Group
    @endmarkdown

    @doc(['slug' => 'group'])
    @enddoc
@stop
