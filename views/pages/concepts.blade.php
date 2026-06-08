@extends('layout.containers.doc')

@section('doc-hero')
    @include('layout.partials.doc-hero', [
        'title' => 'Concepts',
        'subtitle' => 'Cross-cutting implementation ideas that show how tokens, inheritance and component overrides behave together in the system.',
        'metaTags' => [
            ['label' => 'Implementation patterns'],
            ['label' => 'Runtime customization'],
        ],
        'primaryCta' => ['label' => 'Open inheritance examples', 'href' => '/concepts/inheritance'],
        'secondaryCta' => ['label' => 'Browse components', 'href' => '/components'],
        'shortcuts' => [
            ['label' => 'Inheritance', 'href' => '/concepts/inheritance'],
            ['label' => 'Inset multiplier', 'href' => '/concepts/inset-multiplier'],
            ['label' => 'Local customization', 'href' => '/concepts/local-customization'],
            ['label' => 'Token system', 'href' => '/concepts/token-system'],
            ['label' => 'Color system', 'href' => '/concepts/color-system'],
            ['label' => 'Design builder', 'href' => '/design-builder'],
        ],
    ])
@endsection

@section('doc-content')
    @typography(['element' => 'h1', 'variant' => 'h1', 'classList' => ['u-margin__bottom--1']])
        Concepts
    @endtypography

    <div class="o-grid o-grid--large">
        <div class="o-grid-12 o-grid-4@md">
            @box([
                'heading' => 'Inheritance',
                'content' => 'See how explicit component overrides, inherit hooks and token defaults resolve in live examples.',
                'link' => '/concepts/inheritance',
                'icon' => 'lightbulb',
            ])
            @endbox
        </div>
        <div class="o-grid-12 o-grid-4@md">
            @box([
                'heading' => 'Local customization',
                'content' => 'See how a section can force reasonable inherited button contrast while still allowing a single button instance to opt out locally.',
                'link' => '/concepts/local-customization',
                'icon' => 'tune',
            ])
            @endbox
        </div>
        <div class="o-grid-12 o-grid-4@md">
            @box([
                'heading' => 'Inset multiplier',
                'content' => 'See how inset spacing is published, inherited, and combined with container-aware scaling across cards, accordions, and tables.',
                'link' => '/concepts/inset-multiplier',
                'icon' => 'open_with',
            ])
            @endbox
        </div>
        <div class="o-grid-12 o-grid-4@md">
            @box([
                'heading' => 'Color system',
                'content' => 'All design token colors as live swatches, with derivation formulas, mix amounts, and usage guidance for every token in the system.',
                'link' => '/concepts/color-system',
                'icon' => 'palette',
            ])
            @endbox
        </div>
        <div class="o-grid-12 o-grid-4@md">
            @box([
                'heading' => 'Token system',
                'content' => 'How global tokens become component-safe runtime inputs, plus a reference for the foundational base tokens and what each one is for.',
                'link' => '/concepts/token-system',
                'icon' => 'schema',
            ])
            @endbox
        </div>
    </div>
@stop
