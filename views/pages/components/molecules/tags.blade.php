@extends('layout.containers.doc')

@section('doc-content')
    @markdown
        # Tags

        List of tags constructed to be shown below articles.
    @endmarkdown

    @doc(['slug' => 'tags'])
    @enddoc
@stop
