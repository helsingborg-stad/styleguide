@extends('layout.containers.doc')

@section('doc-content')
<article>
  @markdown([])
    #Layout Grid
  @endmarkdown
    @doc(['viewDoc' => ['type' => 'objects', 'root' => 'layout-grid', 'config' => 'Layout-grid']])
    @enddoc

    @paper(['padding' => '3', 'classList' => ['u-margin__top--10']])
      @typography(['variant' => 'h3', 'element' => 'h3'])
        Examples
      @endtypography

      @typography(['variant' => 'body', 'element' => 'p'])
        Practical examples for common layout-grid use cases.
      @endtypography

      @code(['language' => 'html', 'content' => '', 'classList' => ['d-code']])
        {{ \HbgStyleGuide\Helper\ParseString::tidyHtml('
          <div class="o-layout-grid o-layout-grid--cols-3 o-layout-grid--gap-4">
            <div class="u-background--primary u-color__text--inverted u-padding--3">Item 1</div>
            <div class="u-background--secondary u-color__text--inverted u-padding--3">Item 2</div>
            <div class="u-background--success u-color__text--inverted u-padding--3">Item 3</div>
          </div>
        ') }}
      @endcode

      <div class="o-layout-grid o-layout-grid--cols-3 o-layout-grid--gap-4 u-margin__top--2">
        <div class="u-background--primary u-color__text--inverted u-padding--3">Item 1</div>
        <div class="u-background--secondary u-color__text--inverted u-padding--3">Item 2</div>
        <div class="u-background--success u-color__text--inverted u-padding--3">Item 3</div>
      </div>
    @endpaper

    @paper(['padding' => '3', 'classList' => ['u-margin__top--10']])
      @typography(['variant' => 'h3', 'element' => 'h3'])
        Span and Alignment
      @endtypography

      @code(['language' => 'html', 'content' => '', 'classList' => ['d-code']])
        {{ \HbgStyleGuide\Helper\ParseString::tidyHtml('
          <div class="o-layout-grid o-layout-grid--cols-4 o-layout-grid--gap-3">
            <div class="o-layout-grid--col-span-2 u-background--complementary u-color__text--inverted u-padding--3">Col span 2</div>
            <div class="o-layout-grid--justify-end u-background--warning u-padding--3">Justify end</div>
            <div class="o-layout-grid--align-end u-background--default u-padding--3">Align end</div>
            <div class="o-layout-grid--col-span-4 u-background--light u-padding--3">Full row item</div>
          </div>
        ') }}
      @endcode

      <div class="o-layout-grid o-layout-grid--cols-4 o-layout-grid--gap-3 u-margin__top--2">
        <div class="o-layout-grid--col-span-2 u-background--complementary u-color__text--inverted u-padding--3">Col span 2</div>
        <div class="o-layout-grid--justify-end u-background--warning u-padding--3">Justify end</div>
        <div class="o-layout-grid--align-end u-background--default u-padding--3">Align end</div>
        <div class="o-layout-grid--col-span-4 u-background--light u-padding--3">Full row item</div>
      </div>
    @endpaper

    @paper(['padding' => '3', 'classList' => ['u-margin__top--10']])
      @typography(['variant' => 'h3', 'element' => 'h3'])
        Container Query Example
      @endtypography

      @code(['language' => 'html', 'content' => '', 'classList' => ['d-code']])
        {{ \HbgStyleGuide\Helper\ParseString::tidyHtml('
          <div class="o-layout-grid o-layout-grid--cq o-layout-grid--cols-1 o-layout-grid--cols-2@md o-layout-grid--gap-2 o-layout-grid--gap-4@md">
            <div class="u-background--primary u-color__text--inverted u-padding--3">Card A</div>
            <div class="u-background--secondary u-color__text--inverted u-padding--3">Card B</div>
            <div class="u-background--success u-color__text--inverted u-padding--3">Card C</div>
            <div class="u-background--warning u-padding--3">Card D</div>
          </div>
        ') }}
      @endcode

      <div class="o-layout-grid o-layout-grid--cq o-layout-grid--cols-1 o-layout-grid--cols-2@md o-layout-grid--gap-2 o-layout-grid--gap-4@md u-margin__top--2">
        <div class="u-background--primary u-color__text--inverted u-padding--3">Card A</div>
        <div class="u-background--secondary u-color__text--inverted u-padding--3">Card B</div>
        <div class="u-background--success u-color__text--inverted u-padding--3">Card C</div>
        <div class="u-background--warning u-padding--3">Card D</div>
      </div>
    @endpaper
</article>
@stop
