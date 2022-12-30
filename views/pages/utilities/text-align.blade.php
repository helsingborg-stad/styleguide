@extends('layout.containers.doc')

@section('doc-content')
<article>

    @markdown
        #Text align
    @endmarkdown
    @utility_doc(['viewDoc' => ['type' => 'utility', 'root' => 'text-align', 'config' => 'text-align']])
        @typography([])
           Apply the text-align utility will place the text within an element to 
        @endtypography

        <div class="u-text-align--left u-color__bg--lighter ">Left</div>
        <div class="u-text-align--right u-color__bg--light">Right</div>
        <div class="u-text-align--center u-color__bg--lighter">Center</div>
        <div class="u-text-align--justify u-color__bg--light">Justify will only appear when there are multiple rows. When there is multiple rows, the text will always cover the full width of the container. To do this the spacing between the words is increased. To view this, change the viewport and the rows will always be edge to edge except for the last row.</div>
    @endutility_doc

</article>
@stop
