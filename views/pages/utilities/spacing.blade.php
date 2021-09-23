@extends('layout.containers.doc')

@section('doc-content')
<article>

    @markdown
        #Spacing (Margin & Padding)
    @endmarkdown
    @utility_doc(['viewDoc' => ['type' => 'utility', 'root' => 'spacing', 'config' => 'spacing']])
        <div class="d-spacing">
            @typography([])
                This example just has padding applied all around.
            @endtypography
            
            <div class="d-spacing__container u-color__bg--default u-padding--2">
                <div class="u-color__bg--secondary">
                </div>
            </div>

            @typography(['classList' => ['u-margin__top--4']])
                You can also just target one side.
            @endtypography

            <div class="d-spacing__container u-color__bg--default u-padding__left--6">
                <div class="u-color__bg--secondary">
                </div>
            </div>

            @typography(['classList' => ['u-margin__top--4']])
                The class also supports axis'.
            @endtypography

            <div class="d-spacing__container u-color__bg--default u-padding__y--2">
                <div class="u-color__bg--secondary">
                </div>
            </div>
        </div>
    @endutility_doc

    @utility_doc(['viewDoc' => ['type' => 'utility', 'root' => 'spacing', 'config' => 'spacing', ]])
        <div class="d-spacing">
            @typography([])
                This example just has margin applied all around.
            @endtypography
            
            <div class="d-spacing__container u-color__bg--default">
                <div class="u-color__bg--secondary u-margin--2">
                </div>
            </div>

            @typography(['classList' => ['u-margin__top--4']])
                You can also just target one side.
            @endtypography

            <div class="d-spacing__container u-color__bg--default">
                <div class="u-color__bg--secondary u-margin__left--2">
                </div>
            </div>

            @typography(['classList' => ['u-margin__top--4']])
                The class also supports axis'.
            @endtypography

            <div class="d-spacing__container u-color__bg--default">
                <div class="u-color__bg--secondary u-margin__x--2">
                </div>
            </div>
        </div>
    @endutility_doc

</article>
@stop
