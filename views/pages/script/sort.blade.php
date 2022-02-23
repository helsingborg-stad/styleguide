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

            <div class="o-grid">

                <div class="o-grid-12 u-color__bg--secondary u-rounded u-padding--2" js-sort-sortable="" js-sort-data="111-0">
                    @typography(['variant' => 'h2', 'element' => 'h2', 'classList' => ['u-color__text--light']])
                        2
                    @endtypography
                </div>

                <div class="o-grid-12 u-color__bg--secondary u-rounded u-padding--2" js-sort-sortable="" js-sort-data="111-0">
                    @typography(['variant' => 'h2', 'element' => 'h2', 'classList' => ['u-color__text--light']])
                        3
                    @endtypography
                </div>

                <div class="o-grid-12 u-color__bg--secondary u-rounded u-padding--2" js-sort-sortable="" js-sort-data="111-0">
                    @typography(['variant' => 'h2', 'element' => 'h2', 'classList' => ['u-color__text--light']])
                        50
                    @endtypography
                </div>

                <div class="o-grid-12 u-color__bg--secondary u-rounded u-padding--2" js-sort-sortable="" js-sort-data="111-0">
                    @typography(['variant' => 'h2', 'element' => 'h2', 'classList' => ['u-color__text--light']])
                        1
                    @endtypography
                </div>

                <div class="o-grid-12 u-color__bg--secondary u-rounded u-padding--2" js-sort-sortable="" js-sort-data="111-0">
                    @typography(['variant' => 'h2', 'element' => 'h2', 'classList' => ['u-color__text--light']])
                        ABC
                    @endtypography
                </div>

                <div class="o-grid-12 u-color__bg--secondary u-rounded u-padding--2" js-sort-sortable="" js-sort-data="111-0">
                    @typography(['variant' => 'h2', 'element' => 'h2', 'classList' => ['u-color__text--light']])
                        AAA
                    @endtypography
                </div>

                <div class="o-grid-12 u-color__bg--secondary u-rounded u-padding--2" js-sort-sortable="" js-sort-data="111-0">
                    @typography(['variant' => 'h2', 'element' => 'h2', 'classList' => ['u-color__text--light']])
                        AAB
                    @endtypography
                </div>
            </div>
        </div>
    @endscript_doc
@stop
