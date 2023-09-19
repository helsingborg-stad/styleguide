@extends('layout.containers.doc')

@section('doc-content')
@mixins_doc(["viewDoc" => ["type" => "mixins", "root" => "paper", "config" => "paper"]])
    @markdown
        #Paper
        Creates a background and shadow for an element. The first parameter needs to be a number between 1 and 5. The second parameter default to "0", but should be a string with a number, this string/number will be multiplied with the base size. In the example the padding will be 16px.
    @endmarkdown

    @paper(['padding' => '3'])
      @group([
      ])
        <span class="mixin-example-paper">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam cursus vel est nec maximus. Praesent mollis non dolor aliquet cursus. Integer eu pellentesque dui. In eu magna ipsum. Vivamus commodo id nisl vitae condimentum.</span>
      @endgroup

      @code(['language' => 'html', 'content' => "", 'classList' => ['d-code', 'u-margin__top--3']])
        {{\HbgStyleGuide\Helper\ParseString::tidyHtml('
         HTML: 
          
                <span class="mixin-example-paper">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam cursus vel est nec maximus. Praesent mollis non dolor aliquet cursus. Integer eu pellentesque dui. In eu magna ipsum. Vivamus commodo id nisl vitae condimentum.</span>
        ')}}
      @endcode
      @code(['language' => 'scss', 'content' => "", 'classList' => ['d-code']])
      SCSS: 

        .mixin-example-paper {
            {{'@'}}include paper(2, "2");
        }
      @endcode
    @endpaper
@endmixins_doc
@stop