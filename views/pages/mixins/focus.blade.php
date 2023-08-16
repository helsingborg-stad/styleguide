@extends('layout.containers.doc')

@section('doc-content')
@mixins_doc(["viewDoc" => ["type" => "mixins", "root" => "focus", "config" => "focus"]])
    @markdown
        #Focus
        Focus styling 
    @endmarkdown

    @paper(['padding' => '3'])
      @group([
      ])
        <span class="mixin-example-focus">This element always have the focus set</span>
      @endgroup

      @code(['language' => 'html', 'content' => "", 'classList' => ['d-code', 'u-margin__top--3']])
        {{\HbgStyleGuide\Helper\ParseString::tidyHtml('
        HTML: 
                    <span class="mixin-example-focus">This element always have the focus set</span>
        ')}}
      @endcode
      @code(['language' => 'scss', 'content' => "", 'classList' => ['d-code']])
      SCSS: 

        .mixins-example-focus {
            {{'@'}}include focus();
        }
      @endcode
    @endpaper

        @markdown
        #Focus remove default
        Removes all focus stylings
    @endmarkdown

    @paper(['padding' => '3'])
      @group([
      ])
        <span class="mixin-example-focus-remove-default mixin-example-focus">This element never have a focused appearance</span>
      @endgroup

      @code(['language' => 'html', 'content' => "", 'classList' => ['d-code', 'u-margin__top--3']])
        {{\HbgStyleGuide\Helper\ParseString::tidyHtml('
        HTML: 
                    <span class="mixin-example-focus-remove-default mixin-example-focus">This element never have a focused appearance</span>
        ')}}
      @endcode
      @code(['language' => 'scss', 'content' => "", 'classList' => ['d-code']])
      SCSS: 

        .mixin-example-focus-remove-default {
            {{'@'}}include focus-remove-default();
        }
        
        .mixin-example-focus-remove-default {
            {{'@'}}include focus();
        }
      @endcode
    @endpaper
    
    @markdown
        #Focus inset
        Adds focus appearance using an after element. Passing true as the second parameter will remove the default focus styling
    @endmarkdown

    @paper(['padding' => '3'])
      @group([
        'attributeList' => [
            'style' => 'position:relative',
        ]
      ])
        <span class="mixin-example-focus-inset">Focused element</span>
      @endgroup

      @code(['language' => 'html', 'content' => "", 'classList' => ['d-code', 'u-margin__top--3']])
        {{\HbgStyleGuide\Helper\ParseString::tidyHtml('
        HTML: 
                    <span class="mixin-example-focus-inset">This element never have a focused appearance</span>
        ')}}
      @endcode
      @code(['language' => 'scss', 'content' => "", 'classList' => ['d-code']])
      SCSS: 

        .mixin-example-focus-remove-default {
            {{'@'}}include focus-inset(4px, false);
        }
      @endcode
    @endpaper
@endmixins_doc
@stop