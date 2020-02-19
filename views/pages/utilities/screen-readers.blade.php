@extends('layout.containers.doc')

@section('doc-content')
<article>

    @markdown
        #Screen readers
    @endmarkdown
    @utility_doc(['viewDoc' => ['type' => 'utility', 'root' => 'screen-readers', 'config' => 'screen-readers']])
        @typography(['element' => 'p'])
            By adding the class <code>u-sr__only</code> we give the element the styling to hide it in the layout but it'll still be accesable in the markup.
            </br>The container below has a text with the class <code>sr-only--focusable</code>.
            Uses for this is for items that should only be accessable through tabbing to but when they're focuesd it should be visible.
        @endtypography
        
        <div class="u-border--1 u-border--secondary u-padding--2 u-display--inline-block">
            <button class="u-sr__only--focusable">You found me!</button>
        </div>
    @endutility_doc

</article>
@stop
