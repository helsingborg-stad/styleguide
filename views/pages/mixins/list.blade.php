@extends('layout.containers.doc')

@section('doc-content')
@mixins_doc(["viewDoc" => ["type" => "mixins", "root" => "list", "config" => "list"]])
    @markdown
        #Unlist
        Unlist a list removing all default styling
    @endmarkdown

    @paper(['padding' => '3'])
      @group([
      ])
        <ul class="mixin-example-unlist">
            <li>1</li>
            <li>2</li>
            <li>3</li>
            <li>4</li>
        </ul>
      @endgroup

      @code(['language' => 'html', 'content' => "", 'classList' => ['d-code', 'u-margin__top--3']])
        {{\HbgStyleGuide\Helper\ParseString::tidyHtml('
         HTML: 
        <ul class="mixin-example-unlist">
                <li>1</li>
                <li>2</li>
                <li>3</li>
                <li>4</li>
        </ul>
        ')}}
      @endcode
      @code(['language' => 'scss', 'content' => "", 'classList' => ['d-code']])
      SCSS: 

        .mixin-example-gradient {
            {{'@'}}include unlist();
        }
      @endcode
    @endpaper
@endmixins_doc
@stop