@extends('layout.containers.doc')

@section('doc-content')
    @markdown
    # Products

    @endmarkdown


    @doc(['slug' => 'product'])
    @enddoc
@stop




