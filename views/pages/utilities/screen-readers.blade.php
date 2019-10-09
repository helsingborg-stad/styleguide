@extends('layout.master')

@section('content')
<article>

    @markdown
        #Screen readers
    @endmarkdown
    @utility_doc(['slug' => 'screen-readers', 'page_config' => true])
        <div class="u-border--1 u-border--primary u-mb--1">
            <p>This container a sr-only text</p>
            <div class="u-sr-only">Screen reader only</div>
        </div>
        
        <div class="u-border--1 u-border--secondary">
                <p>This container a sr-only--focusable text</p>
            <div class="u-sr-only--focusable">Screen reader only</div>
        </div>
    @endutility_doc

</article>
@stop
