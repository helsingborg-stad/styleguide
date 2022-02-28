@extends('layout.containers.doc')

@section('doc-content')
    @markdown
        #Grid
        Grid is an object that allows you to create a grid of elements. Please note that we support both the .grid and .o-grid syntax. However the .grid class should be considered deprecated and .o-grid  as it's better scoped and is therefor favored.
    @endmarkdown

    @paper(['padding' => '3'])
      @typography(['variant' => 'h3', 'element' => 'h3'])
        Regular grid
      @endtypography

      <div class="d-code__toggle c-code__toggle">
        @button([
            'text' => 'HTML',
            'color' => 'default',
            'type' => 'basic',
            'size' => 'md',
            'icon' => 'code'
        ])
        @endbutton
      </div>

      @code(['language' => 'html', 'content' => "", 'classList' => ['d-code']])
        {{\HbgStyleGuide\Helper\ParseString::tidyHtml('
          <div class="o-grid">
              <div class="o-grid-12@sm o-grid-6@md o-grid-4@lg">Column</div>
              <div class="o-grid-12@sm o-grid-6@md o-grid-4@lg">Column</div>
              <div class="o-grid-12@sm o-grid-6@md o-grid-4@lg">Column</div>
              <div class="o-grid-12@sm o-grid-6@md o-grid-4@lg">Column</div>
          </div>
        ')}}
      @endcode

    @endpaper
@stop
