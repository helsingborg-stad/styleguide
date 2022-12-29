@extends('layout.containers.doc')

@section('doc-content')
<article>

    @markdown
        #Accessability
    @endmarkdown
    @utility_doc(['viewDoc' => ['type' => 'utility', 'root' => 'accessability', 'config' => 'accessability']])
        @typography([])
           Applying the accessability utility class makes the element non-visible on the display but accessible for the screen reader. Just adding the class <strong>u-sr__only</strong> removes the visuals and the visual functionality, adding the modifier <strong>u-sr__only--focusable</strong> allows the element to be visible while in focus.
        @endtypography

        @typography([])
           Try me in a screen reader (.u-sr__only). 
           @link([
            'classList' => ['u-sr__only'],
            'href' => '#'
            ])
                Here is the hidden content without the modifier.
            @endlink
        @endtypography
        
        @typography([])
            Try me in a screen reader (.u-sr__only--focusable). 
            @link([
                'classList' => ['u-sr__only--focusable'],
                'href' => '#'
            ])
                Here is the hidden content with the modifier.
            @endlink
        @endtypography
    @endutility_doc

</article>
@stop
