@extends('layout.containers.doc')

@section('doc-content')
<article>

    @markdown
        #Sizing

        ### Sizing width
    @endmarkdown
    

    @utility_doc(['viewDoc' => ['type' => 'utility', 'root' => 'sizing', 'config' => 'sizing_width']])

        @typography([])
            The green element is given 50% width and blue one is given 25%.
        @endtypography

        <div class="d-sizing">
            <div class="u-width--100 u-color__bg--default u-padding--2  u-rounded" style="height: 100px;">
                <div class="u-width--50 u-height--100 u-display--inline-block u-color__bg--success  u-rounded">
                </div>

                <div class="u-width--25 u-height--100 u-display--inline-block u-color__bg--info u-rounded">
                </div>
            </div>
        </div>
    
    @endutility_doc    

    @markdown
      ### Sizing height
    @endmarkdown

    @utility_doc(['viewDoc' => ['type' => 'utility', 'root' => 'sizing', 'config' => 'sizing_height']])

        @typography([])
            In this example we've given the green element 50% height and the blue one 25%.
        @endtypography

        <div class="d-sizing">
            <div class="u-color__bg--default u-padding--2 u-rounded" style="height: 300px;">
                <div class="u-height--50 u-width--25 u-display--inline-block u-color__bg--success  u-rounded">
                </div>

                <div class="u-height--25 u-width--25 u-display--inline-block u-color__bg--info  u-rounded">
                </div>
            </div>
        </div>

    @endutility_doc  
    
</article>
@stop