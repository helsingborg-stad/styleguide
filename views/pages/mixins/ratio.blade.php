@extends('layout.containers.doc')

@section('doc-content')
@mixins_doc(["viewDoc" => ["type" => "mixins", "root" => "ratio", "config" => "ratio"]])
    @markdown
        #Ratio
        Ratio calculates the ratio based on the width of the element. This way you can get basic ratio settings like 16/9. Pseudo will be false as default, setting it to true adds the ratio as a before pseudo to the element.
    @endmarkdown

    @paper(['padding' => '3'])
      @group([
      ])
        <span class="mixin-example-ratio" style="width:100%; background-color:blue;"></span>
      @endgroup

      @code(['language' => 'html', 'content' => "", 'classList' => ['d-code', 'u-margin__top--3']])
        {{\HbgStyleGuide\Helper\ParseString::tidyHtml('
         HTML: 

             <span class="mixin-example-ratio">_</span>      
        ')}}
      @endcode
      @code(['language' => 'scss', 'content' => "", 'classList' => ['d-code']])
      SCSS: 

        .mixin-example-ratio {
            {{'@'}}include ratio(16, 2);
        }
      @endcode
    @endpaper
@endmixins_doc
@stop