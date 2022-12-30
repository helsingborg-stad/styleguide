@extends('layout.containers.doc')

@section('doc-content')
    @markdown
        #List
        The list mixin lets you change the visuals of a list.
    @endmarkdown

    @paper(['padding' => '3'])
      @typography(['variant' => 'h3', 'element' => 'h3'])
        Unlist
      @endtypography

        <ul class="mixins-example-list">
            <li>
                This list item has no visual list styling.
            </li>
        </ul>

      @code(['language' => 'html', 'content' => "", 'classList' => ['d-code', 'u-margin__top--3']])
        {{\HbgStyleGuide\Helper\ParseString::tidyHtml('
            <ul class="mixins-example-list">
                <li>
                    This list item has no visual list styling.
                </li>
            </ul>
        ')}}
      @endcode
      @code(['language' => 'scss', 'content' => "", 'classList' => ['d-code']])
        .mixins-example-list {
            {{'@'}}include unlist()
        }
      @endcode

    @endpaper
@stop

<style>
    .mixins-example-list   {
        list-style-type: none;
    }
    .mixins-example-list li::before, .mixins-example-list::before {
        display: none;
    }
    
</style>
