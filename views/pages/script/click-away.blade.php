@extends('layout.containers.doc')

@section('doc-content')
    @markdown
        #Click Away
    @endmarkdown

    @script_doc(["viewDoc" => ["type" => "script", "root" => "clickAway", "config" => "ClickAway"]])

        <h2 data-js-click-away="u-color__text--info" class="u-color__text--success u-color__text--info u-border--2 u-border__color--info u-margin u-padding--2">
            Click outside this element to change the color of this text into green.
        </h2>
        
    @endscript_doc
@stop
