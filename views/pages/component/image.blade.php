@extends('layout.master')

@section('content')

    @markdown
    #Image
    Displays a simple image. If it is missing it may be replaced with a placeholder. Alt, captions and radius can be added.
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
            'src'=> "https://picsum.photos/300/200?image=1028",
            'alt' => "This is a image",
            'caption' => "Click image to open a modal with a bigger image example",
            'modalId' => "exampleModal"
            ])
            @endimage
        </div>
    </div>

    @modal([
    'heading'=> "Hey, Im a modal with an image?",
    'isPanel' => false,
    'id' => 'exampleModal',
    'overlay' => 'dark',
    'animation' => 'scale-up'
    ])
        @image([
        'src'=> "https://picsum.photos/600/500?image=1028",
        'alt' => "This is a image in a modal",
        'caption' => "Another caption",
        ])
        @endimage

    @endmodal

    @enddoc

    
    @doc(['slug' => 'image'])
    <div class="grid">
        <div class="grid-s-12 grid-md-6">

            @markdown
            ###Rounded corners (All corners)
            @endmarkdown

            @image([
            'src'=> "https://picsum.photos/300/200?image=1032",
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
            'src'=> "https://picsum.photos/300/200?image=1050",
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
