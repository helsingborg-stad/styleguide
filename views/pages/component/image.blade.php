@extends('layout.master')

@section('content')
    @markdown
        #Image
        Displays a simple image. If it is missing it may be replaced with a placeholder. Alt and captions can be added.
    @endmarkdown

    @doc(['slug' => 'image'])

        @image([
            'src'=> "https://picsum.photos/300/200?image=1026",
            'alt' => "This is a image",
            'caption' => "Hey, I am a caption"
        ])
        @endimage

    @enddoc
@stop
