@extends('layout.master')

@section('content')
    
    {!!
        markdown('
            #Cards

            Nullam quis risus eget urna mollis ornare vel eu leo. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
        ')
    !!}

    @include('layout.doc', [
        'markup' => component(
            'card',
            $settings = [
                'title' => "The card title",
                'image' => "https://picsum.photos/700/450?image=1072",
                'content' => "Yay, im a beautiful card. I'm right here! Look at me!"
            ]
        ),
        'settings' => $settings
    ])

    @include('layout.doc', [
        'markup' => component(
            'card',
            [
                'title' => "Another card, yay!",
                'content' => "Yay, Im a card!"
            ]
        )
    ])

@stop




