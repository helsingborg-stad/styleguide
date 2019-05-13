@extends('layout.master')

@section('content')
    @markdown
        #Gallery
        Prints a list if thumbnails, linked to a larger version of the thumbnail. 
    @endmarkdown

    @doc(['slug' => 'gallery'])
        @gallery([
    'classList' => ['unlist'],
    'list' => [
                ['largeImage' => "https://picsum.photos/900/600?image=1026", 'smallImage' => "https://picsum.photos/300/200?image=1026", 'caption' => "Image with stuff", 'alt' => "The alt text"],
                ['largeImage' => "https://picsum.photos/900/600?image=1038", 'smallImage' => "https://picsum.photos/300/200?image=1038", 'caption' => "Image with stuff", 'alt' => "The alt text"],
                ['largeImage' => "https://picsum.photos/900/600?image=1043", 'smallImage' => "https://picsum.photos/300/200?image=1043", 'caption' => "Image with stuff", 'alt' => "The alt text"],
                ['largeImage' => "https://picsum.photos/900/600?image=1039", 'smallImage' => "https://picsum.photos/300/200?image=1039", 'caption' => "Image with stuff", 'alt' => "The alt text"],
                ['largeImage' => "https://picsum.photos/900/600?image=1006", 'smallImage' => "https://picsum.photos/300/200?image=1006", 'caption' => "Image with stuff", 'alt' => "The alt text"],
                ['largeImage' => "https://picsum.photos/900/600?image=993", 'smallImage' => "https://picsum.photos/300/200?image=993", 'caption' => "Image with stuff", 'alt' => "The alt text"],
            ]
        ])
        @endgallery
    @enddoc
@stop


