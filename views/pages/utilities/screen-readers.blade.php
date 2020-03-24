@extends('layout.containers.doc')

@section('doc-content')
<article>

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
