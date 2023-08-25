@extends('layout.containers.doc')

@section('doc-content')
@mixins_doc(["viewDoc" => ["type" => "mixins", "root" => "button", "config" => "button"]])
    @markdown
        #Center
        Centers an element
    @endmarkdown

    @paper(['padding' => '3'])
      @group([
        'alignItems' => 'center',
      ])
        <span class="">Element</span>
      @endgroup

      @code(['language' => 'html', 'content' => "", 'classList' => ['d-code', 'u-margin__top--3']])
        {{\HbgStyleGuide\Helper\ParseString::tidyHtml('
        HTML: 
            <span class="mixins-example-arrow">_</span>
        ')}}
      @endcode
      @code(['language' => 'scss', 'content' => "", 'classList' => ['d-code']])
      SCSS: 

        .mixins-example-arrow {
            {{'@'}}include button-mix(#000, #42c765, #ac42c7)
        }
      @endcode
    @endpaper

    @markdown
        #Button-size
        Sets the sizing of a button.
    @endmarkdown

    @paper(['padding' => '3'])
      @group([
        'alignItems' => 'center',
      ])
        <span class="mixins-example-button-mix mixin-example-button-size">Button</span>
      @endgroup

      @code(['language' => 'html', 'content' => "", 'classList' => ['d-code', 'u-margin__top--3']])
        {{\HbgStyleGuide\Helper\ParseString::tidyHtml('
        HTML: 
             <span class="mixin-example-button-size mixins-example-button-mix">Button</span>
        ')}}
      @endcode
      @code(['language' => 'scss', 'content' => "", 'classList' => ['d-code']])
        SCSS: 

        .mixin-example-button-size {
            {{'@'}}include button-size(8px, 12px, 16px, 4px);
        }

        .mixins-example-arrow {
            {{'@'}}include button-mix(#000, #42c765, #ac42c7);
        }
      @endcode

    @endpaper

    @markdown
        #Button-unstyled
        Removes all button styling
    @endmarkdown

     @paper(['padding' => '3'])
      @group([
        'alignItems' => 'center',
      ])
        <span class="mixin-example-button-unstyled mixins-example-button-mix mixin-example-button-size">Button</span>
      @endgroup

      @code(['language' => 'html', 'content' => "", 'classList' => ['d-code', 'u-margin__top--3']])
        {{\HbgStyleGuide\Helper\ParseString::tidyHtml('
        HTML: 
             <span class="mixin-example-button-unstyled mixins-example-button-mix mixin-example-button-size">Button</span>
        ')}}
      @endcode
      @code(['language' => 'scss', 'content' => "", 'classList' => ['d-code']])
        SCSS: 

        .mixin-example-button-unstyled {
            {{'@'}}include button-unstyled();
        }

        .mixins-example-arrow {
            {{'@'}}include button-mix(#000, #42c765, #ac42c7);
        }

        .mixin-example-button-size {
            {{'@'}}include button-size(8px, 12px, 16px, 4px);
        }
      @endcode

    @endpaper
@endmixins_doc
@stop