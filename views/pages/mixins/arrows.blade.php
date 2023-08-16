@extends('layout.containers.doc')

@section('doc-content')
@mixins_doc(["viewDoc" => ["type" => "mixins", "root" => "arrows", "config" => "arrows"]])
    @markdown
        #Arrows
        The arrows mixin lets you create an arrow using borders. 
    @endmarkdown

    @paper(['padding' => '3'])
      @group([
        'alignItems' => 'center',
      ])
        arrow up <span class="mixins-example-arrow"></span>
      @endgroup

      @code(['language' => 'html', 'content' => "", 'classList' => ['d-code', 'u-margin__top--3']])
        {{\HbgStyleGuide\Helper\ParseString::tidyHtml('
        HTML: 
            <span class="mixins-example-arrow"></span>
        ')}}
      @endcode
      @code(['language' => 'scss', 'content' => "", 'classList' => ['d-code']])
      SCSS: 
        .mixins-example-arrow {
            {{'@'}}include arrow("up", 8px, #000)
        }
      @endcode

    @endpaper
@endmixins_doc
@stop