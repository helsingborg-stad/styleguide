@extends('layout.containers.doc')

@section('doc-content')
    @typography(['element' => 'h1', 'variant' => 'h1', 'classList' => ['u-margin__bottom--1']])
        Animation scripts
    @endtypography
    @typography(['element' => 'p', 'variant' => 'body', 'classList' => ['u-margin__bottom--3']])
        Motion utilities that add visual feedback while keeping behavior declarative.
    @endtypography

    <div class="o-grid o-grid--large">
        <div class="o-grid-12 o-grid-4@md">
            @box(['heading' => 'Animate', 'content' => 'Configure predefined animation effects and bindings.', 'link' => '/script/animation/animate', 'icon' => 'animation'])
            @endbox
        </div>
    </div>
@stop
