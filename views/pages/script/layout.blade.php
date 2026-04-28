@extends('layout.containers.doc')

@section('doc-content')
    @typography(['element' => 'h1', 'variant' => 'h1', 'classList' => ['u-margin__bottom--1']])
        Layout & observer scripts
    @endtypography
    @typography(['element' => 'p', 'variant' => 'body', 'classList' => ['u-margin__bottom--3']])
        Utilities that adapt layout flow by moving elements and tracking container dimensions.
    @endtypography

    <div class="o-grid o-grid--large">
        <div class="o-grid-12 o-grid-4@md">
            @box(['heading' => 'Move to', 'content' => 'Relocate elements into another target container.', 'link' => '/script/layout/move-to', 'icon' => 'move_up'])
            @endbox
        </div>
        <div class="o-grid-12 o-grid-4@md">
            @box(['heading' => 'Size observer', 'content' => 'Expose element dimensions through CSS custom properties.', 'link' => '/script/layout/size-observer', 'icon' => 'straighten'])
            @endbox
        </div>
    </div>
@stop
