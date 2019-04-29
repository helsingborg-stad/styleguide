@extends('layout.master')

@section('content')
    @markdown
        #Logotype
        Displays a logotype. If it is missing it may be replaced with a placeholder. Alt and captions can be added.
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
