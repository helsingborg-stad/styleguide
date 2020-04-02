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
                    'u-color__bg--default',
                    'u-text-align--center',
                ],
                'attributeList' => [
                    'js-sort-data-container' => ''
                ]
            ])

                @grid([
                    "classList" => [
                        "u-color__bg--secondary",
                        "u-rounded",
                        "u-padding--2"
                    ],
                    'attributeList' => [
                        'js-sort-sortable' => '',
                        'js-sort-data' => '111-0'
                    ]
                ])
                    @typography(['variant' => 'h2', 'element' => 'h2', 'classList' => ['u-color__text--light']])
                        2
                    @endtypography
                @endgrid

                @grid([
                    "classList" => [
                        "u-color__bg--secondary",
                        "u-rounded",
                        "u-padding--2"
                    ],
                    'attributeList' => [
                        'js-sort-sortable' => '',
                        'js-sort-data' => '111-0'
                    ]
                ])
                    @typography(['variant' => 'h2', 'element' => 'h2', 'classList' => ['u-color__text--light']])
                        3
                    @endtypography
                @endgrid

                @grid([
                    "classList" => [
                        "u-color__bg--secondary",
                        "u-rounded",
                        "u-padding--2"
                    ],
                    'attributeList' => [
                        'js-sort-sortable' => '',
                        'js-sort-data' => '111-0'
                    ]
                ])
                    @typography(['variant' => 'h2', 'element' => 'h2', 'classList' => ['u-color__text--light']])
                        50
                    @endtypography
                @endgrid

                @grid([
                    "classList" => [
                        "u-color__bg--secondary",
                        "u-rounded",
                        "u-padding--2"
                    ],
                    'attributeList' => [
                        'js-sort-sortable' => '',
                        'js-sort-data' => '111-0'
                    ]
                ])
                    @typography(['variant' => 'h2', 'element' => 'h2', 'classList' => ['u-color__text--light']])
                        1
                    @endtypography
                @endgrid

                @grid([
                    "classList" => [
                        "u-color__bg--secondary",
                        "u-rounded",
                        "u-padding--2"
                    ],
                    'attributeList' => [
                        'js-sort-sortable' => '',
                        'js-sort-data' => '111-0'
                    ]
                ])
                    @typography(['variant' => 'h2', 'element' => 'h2', 'classList' => ['u-color__text--light']])
                        ABC
                    @endtypography
                @endgrid

                @grid([
                    "classList" => [
                        "u-color__bg--secondary",
                        "u-rounded",
                        "u-padding--2"
                    ],
                    'attributeList' => [
                        'js-sort-sortable' => '',
                        'js-sort-data' => '111-0'
                    ]
                ])
                    @typography(['variant' => 'h2', 'element' => 'h2', 'classList' => ['u-color__text--light']])
                        AAA
                    @endtypography
                @endgrid

                @grid([
                    "classList" => [
                        "u-color__bg--secondary",
                        "u-rounded",
                        "u-padding--2"
                    ],
                    'attributeList' => [
                        'js-sort-sortable' => '',
                        'js-sort-data' => '111-0'
                    ]
                ])
                    @typography(['variant' => 'h2', 'element' => 'h2', 'classList' => ['u-color__text--light']])
                        AAB
                    @endtypography
                @endgrid
            @endgrid
        </div>
    @endscript_doc
@stop
