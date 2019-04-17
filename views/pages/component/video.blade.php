@extends('layout.master')

@section('content')
    @markdown
        #Video
        Displays a simple video player.
    @endmarkdown

    @doc(['slug' => 'video'])
        @video([
            'formats' => [
                ['src' => "https://storage.googleapis.com/coverr-main/mp4/Self-Serve-in-Arizona.mp4", 'type' => "mp4"],
            ]
        ])
        @endvideo
    @enddoc
@stop



