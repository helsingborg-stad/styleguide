@extends('layout.containers.doc')

@section('doc-content')
    @markdown
        #Toggle
    @endmarkdown

    @script_doc(["viewDoc" => ["type" => "script", "root" => "toggle", "config" => "toggle"]])

        @typography([
            'element' => 'h4',
            'variant' => 'subtitle'
        ])
            Toggle single
        @endtypography

        <div class="u-margin__bottom--5" style="text-align: center;">
            @button([
                'href' => '#btn-3',
                'isOutlined' => false,
                'isPrimary' => false,
                'isCircle' => true,
                'attributeList' => [
                    'js-toggle-trigger' => 'example',
                ]
            ])
                Toggle background color
            @endbutton

            <div class="u-rounded" js-toggle-item="example" js-toggle-class="u-color__bg--primary">
                @typography([
                    'element' => 'h4',
                    'variant' => 'subtitle',
                    'classList' => ['u-color__text--primary', 'u-margin__top--2']
                ])
                    Toggle me!
                @endtypography
            </div>
        </div>

        @typography([
            'element' => 'h4',
            'variant' => 'subtitle'
        ])
            Toggle group
        @endtypography

        @buttonGroup(['borderColor' => 'default', 'classList' => ['u-margin__bottom--3']])
            @button([
                'text' => 'Box One',
                'color' => 'default',
                'type' => 'basic',
                'size' => 'md',
                'icon' => 'code',
                'toggle' => true,
                'attributeList' => ['js-toggle-trigger' => "iddd", 'js-toggle-group' => "example2"]
            ])
            @endbutton
            @button([
                'text' => 'Box Two',
                'color' => 'default',
                'type' => 'basic',
                'size' => 'md',
                'icon' => 'code',
                'toggle' => true,
                'attributeList' => ['js-toggle-trigger' => "iddd2", 'js-toggle-group' => "example2"]
            ])
            @endbutton
        @endbuttonGroup

        @grid(["container" => true, 'classList' => ['u-color__bg--default', 'u-rounded', 'u-padding']])
            @grid([
                "col" => [
                    "xs" => [1,7],
                    "sm" => [1,7],
                    "md" => [1,7],
                    "lg" => [1,7],
                    "xl" => [1,7]
                ],
                "row" => [
                    "xs" => [1,2],
                    "sm" => [1,2],
                    "md" => [1,2],
                    "lg" => [1,2],
                    "xl" => [1,2]
                ],
                "classList" => [
                    "u-rounded",
                    'u-padding--2'
                ],
                "attributeList" => [
                    "js-toggle-item" => 'iddd',
                    "js-toggle-class" => 'u-color__bg--secondary',
                    "js-toggle-group" => "example2"
                ]
            ])
            @endgrid

            @grid([
                "col" => [
                    "xs" => [7,13],
                    "sm" => [7,13],
                    "md" => [7,13],
                    "lg" => [7,13],
                    "xl" => [7,13]
                ],
                "row" => [
                    "xs" => [1,2],
                    "sm" => [1,2],
                    "md" => [1,2],
                    "lg" => [1,2],
                    "xl" => [1,2]
                ],
                "classList" => [
                    "u-rounded",
                    'u-padding--2'
                ],
                "attributeList" => [
                    "js-toggle-item" => 'iddd2',
                    "js-toggle-class" => 'u-color__bg--secondary',
                    "js-toggle-group" => "example2"
                ]
            ])
            @endgrid
        @endgrid
        
    @endscript_doc
@stop
