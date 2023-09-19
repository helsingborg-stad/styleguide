@extends('layout.containers.doc')

@section('doc-content')
@mixins_doc(["viewDoc" => ["type" => "mixins", "root" => "fluidType", "config" => "fluidType"]])
    @markdown
        #Fluid-type
        Sets a fluid font size
    @endmarkdown

    @paper(['padding' => '3'])
      @group([
      ])
        <span class="mixin-example-fluid-type">This element have a fluid font size. When the viewport gets smaller, so will this font size.</span>
      @endgroup

      @code(['language' => 'html', 'content' => "", 'classList' => ['d-code', 'u-margin__top--3']])
        {{\HbgStyleGuide\Helper\ParseString::tidyHtml('
        HTML: 
            <span class="mixin-example-fluid-type">This element have a fluid font size. When the viewport gets smaller, so will this font size.</span>
        ')}}
      @endcode
      @code(['language' => 'scss', 'content' => "", 'classList' => ['d-code']])
      SCSS: 

        .mixins-example-fluid-type {
            {{'@'}}include fluid-type(8px, 24px, 2vw);
        }
      @endcode
    @endpaper
@endmixins_doc
@stop