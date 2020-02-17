@extends('layout.containers.doc')

@section('doc-content')
    @markdown
        # Tabs
    @endmarkdown

    @doc(['slug' => 'tabs'])
    @enddoc
@stop
