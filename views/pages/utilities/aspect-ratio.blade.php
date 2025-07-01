@extends('layout.containers.doc')

@section('doc-content')
<article>

    @markdown
        #Aspect Ratio
    @endmarkdown
    @utility_doc(['viewDoc' => ['type' => 'utility', 'root' => 'aspect-ratio', 'config' => 'aspect-ratio']])
        @typography([])
           The aspect ratio utility class allows you to maintain a consistent width-to-height ratio for elements, such as images or videos. Use <strong>u-aspect-ratio</strong> to apply a default aspect ratio, or use modifiers like <strong>u-aspect-ratio--16-9</strong> or <strong>u-aspect-ratio--4-3</strong> for specific ratios.
        @endtypography
        <div class="u-color__bg--default u-rounded u-padding--2 u-margin__bottom--5">
            @typography([
                "element" => "h3",
                "variant" => "h3",
                "classList" => ["u-margin__top--2"]
            ])
                Responsive aspect ratio container
            @endtypography

            <div class="u-aspect-ratio u-aspect-ratio--16-9" style="max-width: 400px; background: #eee;">
                <span style="display: flex; align-items: center; justify-content: center; height: 100%;">16:9 Content</span>
            </div>
        </div>
        
        <div class="u-color__bg--default u-rounded u-padding--2">
            @typography([
                "element" => "h3",
                "variant" => "h3",
                "classList" => ["u-margin__top--2"]
            ])
                4:3 aspect ratio container
            @endtypography

            <div class="u-aspect-ratio u-aspect-ratio--4-3" style="max-width: 400px; background: #eee;">
                <span style="display: flex; align-items: center; justify-content: center; height: 100%;">4:3 Content</span>
            </div>
        </div>
    @endutility_doc

</article>
@stop
