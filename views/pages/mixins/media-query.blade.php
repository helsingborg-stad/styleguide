@extends('layout.containers.doc')

@section('doc-content')
@mixins_doc(["viewDoc" => ["type" => "mixins", "root" => "mediaQuery", "config" => "mediaQuery"]])
    @markdown
        #Media query
        Creates a media query for a class. Resize the window to see the changes between blue and green background color.
    @endmarkdown

    @paper(['padding' => '3'])
      @group([
      ])
        <span class="mixin-example-mq" style="height:300px;width:100%;"></span>
      @endgroup

      @code(['language' => 'html', 'content' => "", 'classList' => ['d-code', 'u-margin__top--3']])
        {{\HbgStyleGuide\Helper\ParseString::tidyHtml('
         HTML: 
             <span class="mixin-example-mq">_</span>
        ')}}
      @endcode
      @code(['language' => 'scss', 'content' => "", 'classList' => ['d-code']])
      SCSS: 

        .mixin-example-mq {
            background-color: green;
            {{'@'}}include mq("lg") {
                background-color: blue;
            }
        }
      @endcode
    @endpaper
@endmixins_doc
@stop