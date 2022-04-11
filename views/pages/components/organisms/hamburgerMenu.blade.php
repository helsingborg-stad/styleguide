@extends('layout.containers.doc')

@section('doc-content')
    @markdown
        #Hamburger menu
    @endmarkdown


    @doc(['slug' => 'hamburgerMenu'])
    @enddoc
@stop