@extends('layout.containers.doc')

@section('doc-content')
    @markdown
        #Gallery
        Prints a list if thumbnails, linked to a larger version of the thumbnail. 
    @endmarkdown

    @doc(['slug' => 'gallery'])
    @enddoc
@stop


