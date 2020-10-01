@extends('layout.containers.doc')

@section('doc-content')
    @markdown
        #Collection
    @endmarkdown

    @doc(['slug' => 'collection'])
    @enddoc
@stop
