@extends('layout.containers.doc')

@section('doc-content')
    @typography(['element' => 'h1', 'variant' => 'h1', 'classList' => ['u-margin__bottom--1']])
        Data & state scripts
    @endtypography
    @typography(['element' => 'p', 'variant' => 'body', 'classList' => ['u-margin__bottom--3']])
        Utilities for filtering, sorting, copying and compressing collections and content.
    @endtypography

    <div class="o-grid o-grid--large">
        <div class="o-grid-12 o-grid-4@md">
            @box(['heading' => 'Filter list', 'content' => 'Search through table rows and list items via data attributes.', 'link' => '/script/data/filter-list', 'icon' => 'filter_list'])
            @endbox
        </div>
        <div class="o-grid-12 o-grid-4@md">
            @box(['heading' => 'Sort', 'content' => 'Sort text and numeric values in a target container.', 'link' => '/script/data/sort', 'icon' => 'sort'])
            @endbox
        </div>
        <div class="o-grid-12 o-grid-4@md">
            @box(['heading' => 'Copy', 'content' => 'Copy data from target attributes or the current element.', 'link' => '/script/data/copy', 'icon' => 'content_copy'])
            @endbox
        </div>
        <div class="o-grid-12 o-grid-4@md">
            @box(['heading' => 'Compress', 'content' => 'Collapse long item groups into concise previews.', 'link' => '/script/data/compress', 'icon' => 'compress'])
            @endbox
        </div>
    </div>
@stop
