@extends('layout.containers.doc')

@section('doc-content')
@mixins_doc(["viewDoc" => ["type" => "mixins", "root" => "arrows", "config" => "arrows"]])
    @markdown
        #Arrows
        The arrows mixin lets create an arrow using borders. 
    @endmarkdown

    @paper(['padding' => '3'])
      @typography(['variant' => 'h3', 'element' => 'h3'])
        Arrow
      @endtypography
    
      @group([
        'alignItems' => 'center',
      ])
        arrow up<span class="mixins-example-arrow"></span>
      @endgroup

      @code(['language' => 'html', 'content' => "", 'classList' => ['d-code', 'u-margin__top--3']])
        {{\HbgStyleGuide\Helper\ParseString::tidyHtml('
            <div class="mixins-example-arrow"></div>
        ')}}
      @endcode
      @code(['language' => 'scss', 'content' => "", 'classList' => ['d-code']])
        .mixins-example-arrow {
            {{'@'}}include arrow()
        }
      @endcode

    @endpaper
@endmixins_doc
@stop

<style>
    .mixins-example-arrow   {
        width: 0;
        height: 0;
        border-top: none;
        border-right: 10px solid transparent;
        border-bottom: 10px solid black;
        border-left: 10px solid transparent;
    }

</style>
