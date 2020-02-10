@extends('layout.containers.doc')

@section('doc-content')
    @markdown
        #Hero
        I'm your hero! I work very well with the slider component. 
    @endmarkdown

    @doc(['slug' => 'hero'])

    @hero([
        'complementaryImage' => '/assets/img/isometric.png',
        'backgroundColor' => '#444e71',
        'headline' => 'Helsingborg Stad', 
        'byline' => 'Styleguide - Version 2.0', 
        'gradientColor' => 'light'
    ])

    @slot('content')
        The Helsingborg Styleguide is a flexible and minimalistic component-based framework built in the BEM standard. 
    @endslot

    @endhero

    @enddoc
@stop



