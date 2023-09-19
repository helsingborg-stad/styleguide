@extends('layout.containers.doc')

@section('doc-content')
@mixins_doc(["viewDoc" => ["type" => "mixins", "root" => "shadow", "config" => "shadow"]])
    @markdown
        #Shadow
        Adds a box shadow to an element. Inset parameter can be used to make an inset box shadow. The third parameter can use box-shadow properties to create a more customized shadow.
    @endmarkdown

    @paper(['padding' => '3'])
      @group([
      ])
        <span class="mixin-example-shadow" style="width:100%; background-color: blue; height: 30px;"></span>
      @endgroup

      @code(['language' => 'html', 'content' => "", 'classList' => ['d-code', 'u-margin__top--3']])
        {{\HbgStyleGuide\Helper\ParseString::tidyHtml('
         HTML: 
             <span class="mixin-example-shadow">_</span>
        ')}}
      @endcode
      @code(['language' => 'scss', 'content' => "", 'classList' => ['d-code']])
      SCSS: 

        .mixin-example-shadow {
            {{'@'}}include shadow(2, true);
        }
      @endcode
    @endpaper
@endmixins_doc
@stop