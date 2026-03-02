@extends('layout.containers.doc')

@section('doc-content')
    @markdown
        #Toggle Button Data
    @endmarkdown

    @script_doc(["viewDoc" => ["type" => "script", "root" => "toggleButtonData", "config" => "toggleButtonData"]])
        @button([
            'text' => 'Click Me!',
            'color' => 'default',
            'type' => 'basic',
            'size' => 'lg',
            'icon' => 'code',
            'toggle' => true,
            'attributeList' => [
                'data-toggle-label' => "Close",
                'data-toggle-icon' => "close"
            ]
        ])
        @endbutton
    @endscript_doc
@stop
