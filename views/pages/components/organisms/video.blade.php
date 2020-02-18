@extends('layout.containers.doc')

@section('doc-content')
    @markdown
        #Video
        Displays a simple video player.
    @endmarkdown

    @doc(['slug' => 'video'])
    @enddoc
@stop



