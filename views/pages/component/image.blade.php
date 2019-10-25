@extends('layout.master')

@section('content')

    @markdown
    #Image
    Displays a simple image. If it is missing it may be replaced with a placeholder. Alt and captions can be added.
    @endmarkdown

    @doc(['slug' => 'image'])
    <div class="grid">

        <div class="grid-s-12 grid-md-6">
            @markdown
            ###Default Image
            @endmarkdown

            @image([
            'src'=> "https://picsum.photos/300/200?image=1026",
            'alt' => "This is a image",
            'caption' => "Hey, I am a caption",
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
            'caption' => "View image in modal"
            ])
            @endimage
        </div>

        <div class="grid-s-12 grid-md-6">

            @markdown
            ###Rounded corners (All corners)
            @endmarkdown

            @image([
            'src'=> "https://picsum.photos/300/200?image=1026",
            'alt' => "This is a image",
            'caption' => "Hey, I am a caption",
            'rounded' => true,
            'roundedRadius' => "md"
            ])
            @endimage
        </div>
        <div class="grid-s-12 grid-md-6">

            @markdown
            ###Rounded corners (top left and  bottom right)
            @endmarkdown

            @image([
            'src'=> "https://picsum.photos/300/200?image=1026",
            'alt' => "This is a image",
            'caption' => "View image in modal",
            'roundedTopLeft' => true,
            'roundedBottomRight' => true
            ])
            @endimage
        </div>



    </div>
    @enddoc
@stop
