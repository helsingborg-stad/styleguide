@extends('layout.containers.doc')

@section('doc-content')
    @markdown
        #Gallery
        Prints a list if thumbnails, linked to a larger version of the thumbnail. 
    @endmarkdown

    @doc(['slug' => 'gallery'])
        @gallery([
            'list' => [
                ['largeImage' => "/assets/img/993-900x600.jpg", 'smallImage' => "/assets/img/993-300x200.jpg", 'caption' => "Image with stuff", 'alt' => "The alt text"],
                ['largeImage' => "/assets/img/1026-900x600.jpg", 'smallImage' => "/assets/img/1026-300x200.jpg", 'caption' => "Sed posuere consectetur est at lobortis. ", 'alt' => "The alt text"],
                ['largeImage' => "/assets/img/1038-900x600.jpg", 'smallImage' => "/assets/img/1038-300x200.jpg", 'caption' => "Image with stuff", 'alt' => "The alt text"],
                ['largeImage' => "/assets/img/1039-900x600.jpg", 'smallImage' => "/assets/img/1039-300x200.jpg", 'caption' => "Image with stuff", 'alt' => "The alt text"],
                ['largeImage' => "/assets/img/1043-900x600.jpg", 'smallImage' => "/assets/img/1043-300x200.jpg", 'caption' => "Image with stuff", 'alt' => "The alt text"],
                ['largeImage' => "/assets/img/1006-900x600.jpg", 'smallImage' => "/assets/img/1006-300x200.jpg", 'caption' => "Image with stuff, and a long description provided in the caption field.", 'alt' => "The alt text"],
            ]

        ])
        @endgallery
    @enddoc
@stop


