@extends('layout.containers.doc')

@section('doc-content')
    @markdown
        #Select
        Ordered or unordered lists. Note: Due to reserverd keywords, this internally is called "listing" and not "list".
    @endmarkdown

    @doc(['slug' => 'select'])
    @enddoc
@stop