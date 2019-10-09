@extends('layout.master')

@section('content')
<article>

    @markdown
        #Responsive Image
    @endmarkdown
    @utility_doc(['slug' => 'responsive-image', 'page_config' => 'true'])
        @image([
            'src'=> "https://picsum.photos/300/200?image=1026",
            'alt' => "This is a image",
            'caption' => "Hey, I am a caption",
            'classList' => ['u-image-responsive']
        ])
        @endimage
    @endutility_doc

</article>
@stop
