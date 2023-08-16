@extends('layout.containers.doc')

@section('doc-content')
@mixins_doc(["viewDoc" => ["type" => "mixins", "root" => "cover", "config" => "cover"]])
    @markdown
        #Cover
        Covers an area completely
    @endmarkdown

    @paper(['padding' => '3'])
      @group([
        'attributeList' => [
            'style' => 'height:300px;position:relative;'
        ]
      ])
        <span class="mixin-example-cover">The grey area is covering the entire parent</span>
      @endgroup

      @code(['language' => 'html', 'content' => "", 'classList' => ['d-code', 'u-margin__top--3']])
        {{\HbgStyleGuide\Helper\ParseString::tidyHtml('
        HTML: 
            <span class="mixin-example-cover">The grey area is covering the entire parent</span>
        ')}}
      @endcode
      @code(['language' => 'scss', 'content' => "", 'classList' => ['d-code']])
      SCSS: 

        .mixins-example-cover {
            {{'@'}}include cover();
        }
      @endcode
    @endpaper
@endmixins_doc
@stop