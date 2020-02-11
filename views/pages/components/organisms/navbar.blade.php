@extends('layout.containers.doc')

@section('doc-content')
    @markdown
        #Navbar
        The navbar component is a traditional navbar with link items. In smaller screen sizes it becomes an expandable menu.
        You can load all the nav items with an array directly on the creation of the component. To load items dynamically
        as the user traverses down the tree of sub menu items is also an option. This is done with javascript and a request to a JSON file.
    @endmarkdown


    @doc(['slug' => 'navbar'])
    @enddoc
@stop