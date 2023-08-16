@extends('layout.containers.doc')

@section('doc-content')
@mixins_doc(["viewDoc" => ["type" => "mixins", "root" => "gradient", "config" => "gradient"]])
    @markdown
        #Gradient
        Creates a gradient background with multiple colors and custom direction.
    @endmarkdown

    @paper(['padding' => '3'])
      @group([
      ])
        <span class="mixin-example-gradient"></span>
      @endgroup

      @code(['language' => 'html', 'content' => "", 'classList' => ['d-code', 'u-margin__top--3']])
        {{\HbgStyleGuide\Helper\ParseString::tidyHtml('
        HTML: 
                    <span class="mixin-example-gradient"></span>
        ')}}
      @endcode
      @code(['language' => 'scss', 'content' => "", 'classList' => ['d-code']])
      SCSS: 

        .mixin-example-gradient {
            {{'@'}}include gradient(30deg, #000, #fff);
        }
      @endcode
    @endpaper
@endmixins_doc
@stop