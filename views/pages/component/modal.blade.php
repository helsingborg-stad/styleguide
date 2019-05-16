@extends('layout.master')

@section('content')
    @markdown
        #Modal
        Popup for important content and notifications. 
    @endmarkdown

    @doc(['slug' => 'logotype'])

        @logotype([
            'src'=> "https://picsum.photos/300/200?image=1026",
            'alt' => "This is a logotype",
            'caption' => "Hey, I am a caption"
        ])
        @endlogotype

    @enddoc
@stop
