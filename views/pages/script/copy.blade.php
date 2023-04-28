@extends('layout.containers.doc')

@section('doc-content')
    @markdown
        #Copy Attribute
    @endmarkdown

    @script_doc(["viewDoc" => ["type" => "script", "root" => "copy", "config" => "copy"]])

        <div data-js-copy-item="example" data-js-copy-data="The copied attribute">Copy an attribute here</div>
        @button([
            'text' => 'Copy another elements attribute',
            'attributeList' => [
                'data-js-copy-target' => 'example',
            ],
            'classList' => ['u-margin__right--8']
        ])
        @endbutton


         @button([
            'text' => 'Copy self',
            'attributeList' => [
                'data-js-copy-target' => 'self',
                'data-js-copy-data' => 'Copy this data'
            ],
        ])
        @endbutton
    <div class="u-margin__top--4">
    <input type="text" placeholder="Paste copied content here" class="u-width--100">
    </div>
    @endscript_doc
@stop
