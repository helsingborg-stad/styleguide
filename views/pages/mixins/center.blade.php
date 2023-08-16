@extends('layout.containers.doc')

@section('doc-content')
@mixins_doc(["viewDoc" => ["type" => "mixins", "root" => "center", "config" => "center"]])
    @markdown
        #Center
        Centers an element
    @endmarkdown

    @paper(['padding' => '3'])
      @group([
        'attributeList' => [
            'style' => 'height:300px;position:relative;'
        ]
      ])
        <span class="mixin-example-center">Element</span>
      @endgroup

      @code(['language' => 'html', 'content' => "", 'classList' => ['d-code', 'u-margin__top--3']])
        {{\HbgStyleGuide\Helper\ParseString::tidyHtml('
        HTML: 
            <span class="mixin-example-center">Element</span>
        ')}}
      @endcode
      @code(['language' => 'scss', 'content' => "", 'classList' => ['d-code']])
      SCSS: 

        .mixins-example-center {
            {{'@'}}include center();
        }
      @endcode
    @endpaper

    @markdown
        #CenterX
        Centers an element horizontally
    @endmarkdown

    @paper(['padding' => '3'])
      @group([
        'attributeList' => [
            'style' => 'height:300px;position:relative;'
        ]
      ])
        <span class="mixin-example-center-x">Element</span>
      @endgroup

      @code(['language' => 'html', 'content' => "", 'classList' => ['d-code', 'u-margin__top--3']])
        {{\HbgStyleGuide\Helper\ParseString::tidyHtml('
        HTML: 
            <span class="mixin-example-center-x">Element</span>
        ')}}
      @endcode
      @code(['language' => 'scss', 'content' => "", 'classList' => ['d-code']])
      SCSS: 

        .mixin-example-center-x {
            {{'@'}}include centerX();
        }
      @endcode
    @endpaper

        @markdown
        #CenterY
        Centers an element vertically
    @endmarkdown

    @paper(['padding' => '3'])
      @group([
        'attributeList' => [
            'style' => 'height:300px;position:relative;'
        ]
      ])
        <span class="mixin-example-center-y">Element</span>
      @endgroup

      @code(['language' => 'html', 'content' => "", 'classList' => ['d-code', 'u-margin__top--3']])
        {{\HbgStyleGuide\Helper\ParseString::tidyHtml('
        HTML: 
            <span class="mixin-example-center-y">Element</span>
        ')}}
      @endcode
      @code(['language' => 'scss', 'content' => "", 'classList' => ['d-code']])
      SCSS: 

        .mixin-example-center-y {
            {{'@'}}include centerY();
        }
      @endcode
    @endpaper
@endmixins_doc
@stop