@extends('layout.master')

@section('content')
    {!!
        markdown('
            #Button

            The button component
        ')
    !!}

    @include('layout.doc', [
        'markup' => component(
            'button',
            [
                'title' => "Another card, yay!",
                'content' => "Yay, Im a card!"
            ]
        )
    ])
@stop
