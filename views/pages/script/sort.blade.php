@extends('layout.containers.doc')

@section('doc-content')
    @markdown
        #Sort
    @endmarkdown

    @script_doc(["viewDoc" => ["type" => "script", "root" => "sort", "config" => "sort"]])
        <div js-sort-container js-sort-order="asc">
            <button js-sort-button="111-0">Sort</button>
            <div class="grid" js-sort-data-container>
                <div class="u-border--1 u-border--success u-color__bg--danger" js-sort-sortable js-sort-data="111-0">2</div>
                <div class="u-border--1 u-border--success u-color__bg--danger" js-sort-sortable js-sort-data="111-0">3</div>
                <div class="u-border--1 u-border--success u-color__bg--danger" js-sort-sortable js-sort-data="111-0">50</div>
                <div class="u-border--1 u-border--success u-color__bg--danger" js-sort-sortable js-sort-data="111-0">1</div>
            </div>
        </div>
    @endscript_doc
@stop
