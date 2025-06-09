@extends('layout.containers.doc')

@section('doc-content')
    @markdown
        #Article
        Renders a article element. 
    @endmarkdown

    @doc(['slug' => 'article'])
    @enddoc
@stop



