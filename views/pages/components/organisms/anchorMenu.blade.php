@extends('layout.containers.doc')

@section('doc-content')
    @markdown
        #Anchor menu
    @endmarkdown

    @doc(['slug' => 'anchorMenu'])
    @enddoc
@stop