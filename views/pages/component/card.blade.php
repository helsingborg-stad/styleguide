@extends('layout.master')

@section('content')
    
    {!!
        markdown('
            #Cards

            Nullam quis risus eget urna mollis ornare vel eu leo. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
        ')
    !!}

    @component('layout.doc', ['settings' => ['test' => "hejk"]])
        @card([
            'title' => "The card title",
            'image' => "https://picsum.photos/700/450?image=1072",
            'content' => "Yay, im a beautiful card. I'm right here! Look at me!",
            'href' => "",
        ])
    @endcomponent

    @component('layout.doc', ['settings' => ['test' => "hejk"]])
        @card()
            @slot('title')
                Hello
            @endslot
        @endcard
    @endcomponent
@stop




