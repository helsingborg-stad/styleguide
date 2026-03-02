@extends('layout.containers.doc')

@section('doc-content')
    @typography(['element' => 'h1', 'variant' => 'h1', 'classList' => ['u-margin__bottom--1']])
        Interaction scripts
    @endtypography
    @typography(['element' => 'p', 'variant' => 'body', 'classList' => ['u-margin__bottom--3']])
        Utilities for click handling, state toggling and user-triggered actions.
    @endtypography

    <div class="o-grid o-grid--large">
        <div class="o-grid-12 o-grid-6@md">
            @box(['heading' => 'Class toggle', 'content' => 'Toggle one or many CSS classes from triggers.', 'link' => '/script/interaction/class-toggle', 'icon' => 'toggle_on'])
            @endbox
        </div>
        <div class="o-grid-12 o-grid-6@md">
            @box(['heading' => 'Click away', 'content' => 'Apply behavior when users click outside a target.', 'link' => '/script/interaction/click-away', 'icon' => 'ads_click'])
            @endbox
        </div>
        <div class="o-grid-12 o-grid-6@md">
            @box(['heading' => 'Simulate click', 'content' => 'Forward click intent to another element.', 'link' => '/script/interaction/simulate-click', 'icon' => 'smart_button'])
            @endbox
        </div>
        <div class="o-grid-12 o-grid-6@md">
            @box(['heading' => 'Toggle button data', 'content' => 'Swap button label and icon states declaratively.', 'link' => '/script/interaction/toggle-button-data', 'icon' => 'sync_alt'])
            @endbox
        </div>
    </div>
@stop
