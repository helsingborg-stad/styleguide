@extends('layout.containers.doc')

@section('doc-content')
@mixins_doc(["viewDoc" => ["type" => "mixins", "root" => "size", "config" => "size"]])
    @markdown
        #Size
        Sets size values for the element. If only one value is used, the height and width will be the same. The unit will default to "px".
    @endmarkdown

    @paper(['padding' => '3'])
      @group([
      ])
        <span class="mixin-example-size" style="background-color: blue;"></span>
      @endgroup

      @code(['language' => 'html', 'content' => "", 'classList' => ['d-code', 'u-margin__top--3']])
        {{\HbgStyleGuide\Helper\ParseString::tidyHtml('
         HTML: 
             <span class="mixin-example-size">_</span>
        ')}}
      @endcode
      @code(['language' => 'scss', 'content' => "", 'classList' => ['d-code']])
      SCSS: 

        .mixin-example-size {
            {{'@'}}include size(3, 4, "em");
        }
      @endcode
    @endpaper
@endmixins_doc
@stop