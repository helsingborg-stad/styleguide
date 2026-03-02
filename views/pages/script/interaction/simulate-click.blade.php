@extends('layout.containers.doc')

@section('doc-content')
    @markdown
        #Simulate click
        When a dom object is clicked with simulate click attrubute the default action of the object will be prevented. A click event will then be sent to the target defined in the data attribute.
    @endmarkdown

    @script_doc(["viewDoc" => ["type" => "script", "root" => "SimulateClick", "config" => "SimulateClick"]])
        @button([
            'text' => 'Go to homepage.',
            'color' => 'default',
            'type' => 'basic',
            'size' => 'lg',
            'icon' => 'code',
            'toggle' => true,
            'attributeList' => [
                'data-simulate-click' => ".c-navbar__logo > a",
            ]
        ])
        @endbutton
    @endscript_doc
@stop
