@extends('layout.containers.doc')

@section('doc-content')
<article>

    @markdown
        #Spacing (Margin & Padding)
    @endmarkdown
    @utility_doc(['viewDoc' => ['type' => 'utility', 'root' => 'spacing', 'config' => 'spacing']])
        <div class="d-sizing">
            @typography([])
                This example just has padding applied all around.
            @endtypography
            
            <div class="u-width--100 u-color__bg--primary u-padding--2" style="height: 100px;">
                <div class="u-width--100 u-height--100 u-color__bg--secondary">
                </div>
            </div>

            @typography(['classList' => ['u-margin__top--4']])
                You can also just target one side.
            @endtypography

            <div class="u-width--100 u-color__bg--primary u-padding__left--6" style="height: 100px;">
                <div class="u-width--100 u-height--100 u-color__bg--secondary">
                </div>
            </div>

            @typography(['classList' => ['u-margin__top--4']])
                The class also supports axis'.
            @endtypography

            <div class="u-width--100 u-color__bg--primary u-padding__y--2" style="height: 100px;">
                <div class="u-width--100 u-height--100 u-color__bg--secondary">
                </div>
            </div>
        </div>
    @endutility_doc

    @utility_doc(['viewDoc' => ['type' => 'utility', 'root' => 'spacing', 'config' => 'spacing', ]])
        <div class="d-sizing">
            @typography([])
                This example just has margin applied all around.
            @endtypography
            
            <div class="u-width--100 u-height--auto u-color__bg--primary">
                <div class="u-width--auto u-color__bg--secondary u-margin--2" style="height: 100px;">
                </div>
            </div>

            @typography(['classList' => ['u-margin__top--4']])
                You can also just target one side.
            @endtypography

            <div class="u-width--100 u-height--auto u-color__bg--primary">
                <div class="u-width--auto u-color__bg--secondary u-margin__left--2" style="height: 100px;">
                </div>
            </div>

            @typography(['classList' => ['u-margin__top--4']])
                The class also supports axis'.
            @endtypography

            <div class="u-width--100 u-height--auto u-color__bg--primary">
                <div class="u-width--auto u-color__bg--secondary u-margin__x--2" style="height: 100px;">
                </div>
            </div>
        </div>
    @endutility_doc

</article>
@stop
