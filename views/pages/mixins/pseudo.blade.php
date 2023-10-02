@extends('layout.containers.doc')

@section('doc-content')
@mixins_doc(["viewDoc" => ["type" => "mixins", "root" => "pseudo", "config" => "pseudo"]])
    @markdown
        #Pseudo
        Creates a background and shadow for an element. The first parameter needs to be a number between 1 and 5. The second parameter default to "0", but should be a string with a number, this string/number will be multiplied with the base size. In the example the padding will be 16px.
    @endmarkdown

    @paper(['padding' => '3'])
        <div class="mixin-example-pseudo">Hello</div>   
      @code(['language' => 'html', 'content' => "", 'classList' => ['d-code', 'u-margin__top--3']])
        {{\HbgStyleGuide\Helper\ParseString::tidyHtml('
         HTML: 

            <div class="mixin-example-pseudo">Hello</div>        
        ')}}
      @endcode
      @code(['language' => 'scss', 'content' => "", 'classList' => ['d-code']])
      SCSS: 

        .mixin-example-pseudo {
            &:before {
                {{'@'}}include pseudo(block, static, "hi");
            }
        }
      @endcode
    @endpaper
@endmixins_doc
@stop