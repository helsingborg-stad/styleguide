@extends('layout.containers.doc')

@section('doc-content')
    @markdown
        #List
        Ordered or unordered lists. Note: Due to reserverd keywords, this internally is called "listing" and not "list".
    @endmarkdown

    @doc(['slug' => 'listing'])
    @enddoc
@stop



        