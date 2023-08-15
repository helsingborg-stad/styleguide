@extends('layout.containers.doc')

@section('doc-content')
    @markdown
        #Anchor menu
        
        The anchor menu keeps track of its position and display to the user which part of the page is active. <br />
        The items in the menu will only show when the there is a matching element on the page.
    @endmarkdown

    @doc(['slug' => 'anchorMenu'])
    @enddoc
@stop