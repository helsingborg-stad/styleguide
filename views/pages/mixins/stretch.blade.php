@extends('layout.containers.doc')

@section('doc-content')
@mixins_doc(["viewDoc" => ["type" => "mixins", "root" => "stretch", "config" => "stretch"]])
    @markdown
        #Stretch
        The Stretch mixin makes an element bleed through the parent covering the whole page width. There need to be a height set in order for it to work correctly.
    @endmarkdown

    @paper(['padding' => '3'])
      @group([
      ])
          <div class="mixin-example-stretch" style="background-color: blue; height: 100px;"></div>
      @endgroup

      @code(['language' => 'html', 'content' => "", 'classList' => ['d-code', 'u-margin__top--3']])
        {{\HbgStyleGuide\Helper\ParseString::tidyHtml('
         HTML: 

          <div class="mixin-example-stretch"></div>
        ')}}
      @endcode
      @code(['language' => 'scss', 'content' => "", 'classList' => ['d-code']])
      SCSS: 

        .mixin-example-stretch {
            {{'@'}}include stretch();
        }
      @endcode
    @endpaper
@endmixins_doc
@stop