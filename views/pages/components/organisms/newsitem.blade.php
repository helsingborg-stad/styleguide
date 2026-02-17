@extends('layout.containers.doc')

@section('doc-content')
    @markdown
        #Newsitem
    @endmarkdown


    @doc(['slug' => 'newsItem'])
    @enddoc
@stop
