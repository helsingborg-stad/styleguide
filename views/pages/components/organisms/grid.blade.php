@extends('layout.containers.doc')

@section('doc-content')
    @markdown
        #Grid
        Prints a list if thumbnails, linked to a larger version of the thumbnail. 
    @endmarkdown

    @doc(['slug' => 'grid'])
    @enddoc
@stop


