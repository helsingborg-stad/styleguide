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
            ['label' => 'Components', 'href' => '/components'],
            ['label' => 'Design builder', 'href' => '/design-builder'],
        ],
    ])
@endsection

@section('doc-content')
    @typography(['element' => 'h1', 'variant' => 'h1', 'classList' => ['u-margin__bottom--1']])
        Concepts
    @endtypography

    <div class="o-grid o-grid--large">
        <div class="o-grid-12 o-grid-6@md">
            @box([
                'heading' => 'Inheritance',
                'content' => 'See how explicit component overrides, inherit hooks and token defaults resolve in live examples.',
                'link' => '/concepts/inheritance',
                'icon' => 'lightbulb',
            ])
            @endbox
        </div>
    </div>
@stop