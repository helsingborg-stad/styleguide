@extends('layout.containers.doc')

@section('doc-content')
    @markdown
        #Mega menu
    @endmarkdown


    @doc(['slug' => 'megaMenu'])
    @enddoc
@stop