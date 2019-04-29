@extends('layout.master')

@section('content')
<article>

    @markdown
        #Javascript
        The styleguide contains a simplistic javascript framework for simple tasks like toggling classes, filtering list and applying usability tweaks. 

        All javascript functions is decpoupled from components (javascript function has no target component). They should be written in a disconnected way from the component scope. 

        Javascript functions can be utilized from the components with inline attributes. Every parameter that is utilized by javascript should be prefixed with the key "js-". 

    @endmarkdown

    @code(['language' => 'html', 'escape' => true, 'preTagElement' => 'pre', 'content' => ""]) 
        <a href="#"                                         //No default action
            js-bind="click"                                     //On what event the javascript should trigger
            js-action="toggleClass"                             //The script to run
            js-toggle-target="component__heading-1"             //The target element to affect
            js-toggle-class="component__heading--is-active"     //What class to toggle
        >
        Im a toggle link!
        </a>
    @endcode

</article>
@stop
