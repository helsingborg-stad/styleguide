@extends('layout.master')

@section('content')

    @markdown
    #Image
    Displays a simple image. If it is missing it may be replaced with a placeholder. Alt and captions can be added.
    @endmarkdown



    @doc(['slug' => 'image', 'displayParams' => false])
    <div class="grid">
        <div class="grid-s-12 grid-md-6">
            @markdown
            ###Just a plain simple Image
            @endmarkdown

            @image([
            'src'=> "https://picsum.photos/300/200?image=1026",
            'alt' => "This is a image",
            'caption' => "Hey, I am a caption for an image",
            ])
            @endimage
        </div>

        <div class="grid-s-12 grid-md-6">
            @markdown
            ###Open image in modal
            @endmarkdown
            @image([
            'src'=> "https://picsum.photos/300/200?image=1026",
            'alt' => "This is a image",
            'caption' => "Click image to open a modal with image"
            ])
            @endimage
        </div>
    </div>
    @enddoc


    @doc(['slug' => 'image'])
    <div class="grid">
        <div class="grid-s-12 grid-md-6">

            @markdown
            ###Rounded corners (All corners)
            @endmarkdown

            @image([
            'src'=> "https://picsum.photos/300/200?image=1026",
            'alt' => "This is a image",
            'caption' => "Image with rounded corners (default size: md)",
            'rounded' => true
            ])
            @endimage
        </div>
        <div class="grid-s-12 grid-md-6">

            @markdown
            ###Rounded (top-left - bottom-right)
            @endmarkdown

            @image([
            'src'=> "https://picsum.photos/300/200?image=1026",
            'alt' => "This is a image",
            'caption' => "Larger corner radius (size: lg) with roundedRadius",
            'roundedTopLeft' => true,
            'roundedBottomRight' => true,
            'roundedRadius' => "lg"
            ])
            @endimage
        </div>
    </div>
    @enddoc


@stop
