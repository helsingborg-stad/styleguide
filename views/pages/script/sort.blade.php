@extends('layout.containers.doc')

@section('doc-content')
    @markdown
        #Sort
    @endmarkdown

    @script_doc(["viewDoc" => ["type" => "script", "root" => "sort", "config" => "sort"]])
        <div js-sort-container js-sort-order="asc">
            @button([
                'text' => 'Sort',
                'color' => 'primary',
                'style' => 'filled',
                'classList' => ['u-margin__bottom--6'],
                'attributeList' =>  [
                    'js-sort-button' => '111-0'
                ]
            ])
            @endbutton

            @grid([
                'container' => true,
                'columns' => 'auto-fit',
                'min_width' => '40px',
                'col_gap' => '2',
                'classList' => [
                    'u-padding--2',
                    'u-color__bg--default'
                ],
                'attributeList' => [
                    'js-sort-data-container' => ''
                ]
            ])

                @grid([
                    "classList" => [
                        "u-color__bg--secondary",
                        "u-rounded"
                    ],
                    'attributeList' => [
                        'js-sort-sortable' => '',
                        'js-sort-data' => '111-0'
                    ]
                ])
                    2
                @endgrid

                @grid([
                    "classList" => [
                        "u-color__bg--secondary",
                        "u-rounded"
                    ],
                    'attributeList' => [
                        'js-sort-sortable' => '',
                        'js-sort-data' => '111-0'
                    ]
                ])
                    3
                @endgrid

                @grid([
                    "classList" => [
                        "u-color__bg--secondary",
                        "u-rounded"
                    ],
                    'attributeList' => [
                        'js-sort-sortable' => '',
                        'js-sort-data' => '111-0'
                    ]
                ])
                    50
                @endgrid

                @grid([
                    "classList" => [
                        "u-color__bg--secondary",
                        "u-rounded"
                    ],
                    'attributeList' => [
                        'js-sort-sortable' => '',
                        'js-sort-data' => '111-0'
                    ]
                ])
                    1
                @endgrid
            @endgrid
        </div>
    @endscript_doc
@stop
