@extends('layout.containers.doc')

@section('doc-content')

<article>

    @markdown
        #Javascript
        The styleguide contains a simplistic javascript framework for simple tasks like toggling classes, filtering list and applying usability tweaks. 

        All javascript functions is decpoupled from components (javascript function has no target component). They should be written in a disconnected way from the component scope. 

        Javascript functions can be utilized from the components with inline attributes. Every parameter that is utilized by javascript should be prefixed with the key "js-". 

    @endmarkdown

</article>
@stop
