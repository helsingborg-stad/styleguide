@extends('layout.containers.doc')

@section('doc-hero')
    @include('layout.partials.doc-hero', [
        'title' => 'JavaScript utilities',
        'subtitle' => 'Reusable, component-agnostic behaviors for interaction, data handling, layout and animation.',
        'metaTags' => [
            ['label' => 'Declarative data attributes'],
            ['label' => 'Progressive enhancement']
        ],
        'primaryCta' => ['label' => 'Start with interaction', 'href' => '/script/interaction'],
        'secondaryCta' => ['label' => 'View data utilities', 'href' => '/script/data'],
        'shortcuts' => [
            ['label' => 'Interaction', 'href' => '/script/interaction'],
            ['label' => 'Data & state', 'href' => '/script/data'],
            ['label' => 'Layout & observer', 'href' => '/script/layout'],
            ['label' => 'Animation', 'href' => '/script/animation'],
        ],
    ])
@endsection

@section('doc-content')
    @typography(['element' => 'h1', 'variant' => 'h1', 'classList' => ['u-margin__bottom--1']])
        Scripts
    @endtypography

    <div class="o-grid o-grid--large">
        <div class="o-grid-12 o-grid-4@md">
            @box([
                'heading' => 'Interaction',
                'content' => 'Toggle behavior, click-away actions and simulated clicks for predictable UI interactions.',
                'link' => '/script/interaction',
                'icon' => 'touch_app',
            ])
            @endbox
        </div>
        <div class="o-grid-12 o-grid-4@md">
            @box([
                'heading' => 'Data & state',
                'content' => 'Filter, sort, copy and compress content to improve navigation and readability in dense interfaces.',
                'link' => '/script/data',
                'icon' => 'dataset',
            ])
            @endbox
        </div>
        <div class="o-grid-12 o-grid-4@md">
            @box([
                'heading' => 'Layout & observer',
                'content' => 'Move elements and react to container size changes while preserving markup intent.',
                'link' => '/script/layout',
                'icon' => 'space_dashboard',
            ])
            @endbox
        </div>
        <div class="o-grid-12 o-grid-4@md">
            @box([
                'heading' => 'Animation',
                'content' => 'Apply controlled motion effects using the documented animation utility patterns.',
                'link' => '/script/animation',
                'icon' => 'animation',
            ])
            @endbox
        </div>
    </div>

    @paper(['padding' => 4, 'classList' => ['u-margin__top--4']])
        @typography(['element' => 'h3', 'variant' => 'h3', 'classList' => ['u-margin__bottom--1']])
            Authoring principles
        @endtypography
        @listing([
            'list' => [
                ['label' => 'Keep scripts component-agnostic and reusable.'],
                ['label' => 'Use explicit data attributes prefixed with `data-js-` for configuration.'],
                ['label' => 'Prefer progressive enhancement so markup still works without JavaScript.'],
                ['label' => 'Document every behavior with a live example and attribute reference.'],
            ],
            'elementType' => 'ul'
        ])
        @endlisting
    @endpaper

@stop
