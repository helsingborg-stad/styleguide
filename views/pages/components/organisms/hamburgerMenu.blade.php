@extends('layout.containers.doc')

@section('doc-content')
    @markdown
        #Hamburger Menu
        Creates a hamburger menu layout
    @endmarkdown

    @doc(['slug' => 'hamburgermenu'])
    @enddoc
@stop


