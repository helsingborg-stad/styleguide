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

    @markdown
        #Screen readers
    @endmarkdown
    @utility_doc(['viewDoc' => ['type' => 'utility', 'root' => 'screen-readers', 'config' => 'screen-readers']])
        <div class="u-color__bg--default u-rounded u-padding--2 u-margin__bottom--5">
            @typography([
                "element" => "h3",
                "variant" => "h3",
                "classList" => ["u-margin__top--2"]
            ])
                This box contains a screen reader only text
            @endtypography

            <button class="u-sr__only">Screen reader only</button>
        </div>
        
        <div class="u-color__bg--default u-rounded u-padding--2">
            @typography([
                "element" => "h3",
                "variant" => "h3",
                "classList" => ["u-margin__top--2"]
            ])
                This box contains a focusable screen reader only text
            @endtypography

            <button class="u-sr__only--focusable">Screen reader only</button>
        </div>
    @endutility_doc

</article>
@stop

