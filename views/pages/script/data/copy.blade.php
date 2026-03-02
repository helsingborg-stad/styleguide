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
            'classList' => ['u-margin__bottom--3']
        ])
        @endbutton

        <br><br>

         @button([
            'text' => 'Copy self',
            'attributeList' => [
                'data-js-copy-target' => 'self',
                'data-js-copy-data' => 'Copy this data',
                'data-js-copy-success' => 'The the text was copied successfully.'
            ],
            'classList' => ['u-margin__left--0']
        ])
        @endbutton
    <div class="u-margin__top--4">
    <input type="text" placeholder="Paste copied content here" class="u-width--100">
    </div>
    @endscript_doc
@stop
