@extends('layout.containers.doc')

@section('doc-content')
    @markdown
        #Tile   
    @endmarkdown


    @doc(['slug' => 'tile'])
    @enddoc
@stop