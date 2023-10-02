@extends('layout.containers.doc')

@section('doc-content')
@mixins_doc(["viewDoc" => ["type" => "mixins", "root" => "responsiveStyles", "config" => "responsiveStyles"]])
    @markdown
        #Responsive styles
        The responsiveStyles mixin facilitates the creation of responsive CSS styles through breakpoints. By providing a map of selectors and styles, this mixin generates media queries for specified breakpoints. The mixin's parameters allow you to customize its behavior. The $breakpoints parameter controls which breakpoints the styles will be applied to, and the $limitToBreakpoint parameter restricts styles to the current breakpoint when set to true. This mixin streamlines the process of crafting responsive designs by encapsulating complex media query logic.
    @endmarkdown

    @paper(['padding' => '3'])
        <div class="mixin-example-responsive-styles--1" style="margin-bottom: 16px; width: 100%;"></div>
        <div class="mixin-example-responsive-styles--2" style="margin-bottom: 16px; width: 100%;"></div>

      @code(['language' => 'html', 'content' => "", 'classList' => ['d-code', 'u-margin__top--3']])
        {{\HbgStyleGuide\Helper\ParseString::tidyHtml('
         HTML: 
          <div class="mixin-example-responsive-styles--1" style="margin-bottom: 16px; width: 100%;"></div>
          <div class="mixin-example-responsive-styles--2" style="margin-bottom: 16px; width: 100%;"></div>
        ')}}
      @endcode
      @code(['language' => 'scss', 'content' => "", 'classList' => ['d-code']])
      SCSS: 

      $exampleOrder: 1;
      {{'@'}}while($exampleOrder <= 2) {
        {{'@'}}include responsiveStyles(
              (
                  ".mixin-example-responsive-styles--#{$exampleOrder}": ( background-color: blue )
              ),
          );
          $exampleOrder: $exampleOrder + 1;
      }
      
      .mixin-example-responsive-styles--1 {
          height: 100px;
      }
      
      .mixin-example-responsive-styles--2 {
          background-color: green;
          height: 100px;
      }
      
      @endcode
    @endpaper
@endmixins_doc
@stop