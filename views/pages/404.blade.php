@extends('layout.master')

@section('content')
    <h1>404 - Page cannot be found</h1>
    <p>This page dosen't exists.</p>
    <pre><code>{{$errorMessage}}</code></pre>

        

        
        @icon(['icon' => 'home', 'label' => 'Mutch icon, wow!'])
        @endicon

        @hero(['backgroundImage' => 'https://picsum.photos/900/600?image=993'])
        @endhero

        @video([
            'formats' => [
                ['src' => "https://storage.googleapis.com/coverr-main/mp4/Self-Serve-in-Arizona.mp4", 'type' => "mp4"],
            ]
        ])
        @endvideo

        @avatar([
            'name' => "Sebastian Thulin"
        ])
        @endavatar

        @avatar([
            'image' => "https://picsum.photos/70/70?image=64"
        ])
        @endavatar

        @heading([
            'label' => "Yo, im a heading.",
            'level' => 3
        ])
        @endbutton

@stop
