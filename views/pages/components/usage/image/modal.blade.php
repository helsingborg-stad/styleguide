@image([
    'src'=> "https://picsum.photos/300/200?image=1028",
    'alt' => "This is a image",
    'caption' => "Click image to open a modal with a bigger image example",
    'modalId' => "examplemodal"
])
@endimage

@modal([
    'heading'=> "Hey, Im a modal with an image?",
    'isPanel' => false,
    'id' => 'exampleModal',
    'overlay' => 'dark',
    'animation' => 'scale-up'
])
    @image([
        'src'=> "https://picsum.photos/600/500?image=1028",
        'alt' => "This is a image in a modal"
    ])
    @endimage

@endmodal