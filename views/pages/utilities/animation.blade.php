@extends('layout.containers.doc')

@section('doc-content')
<article>

    @markdown
        #Animation
    @endmarkdown
    @utility_doc(['viewDoc' => ['type' => 'utility', 'root' => 'animation', 'config' => 'animation']])
        @typography([])
           Can be used to toggle an animation. Hover the image below and press the button to toggle the utility.
        @endtypography
        @hero([
            'image' => 'https://picsum.photos/1080/720',
            'animation' => 'animation-type-kenny'
        ])
        @endhero
    @endutility_doc

</article>
@stop
