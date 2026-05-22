@extends('layout.containers.home')

@section('doc-hero')
    @include('layout.partials.doc-hero', [
        'title' => 'Municipio Design System',
        'subtitle' => 'A comprehensive design system for building consistent, accessible and efficient digital experiences across all multiple platforms.',
        'metaTags' => [
            ['label' => 'Version 3.0']
        ],
        'primaryCta' => ['label' => 'Browse components', 'href' => '/components'],
        'secondaryCta' => ['label' => 'View setup guide', 'href' => '/setup'],
        'shortcuts' => [
            ['label' => 'Components', 'href' => '/components'],
            ['label' => 'Utilities', 'href' => '/utilities'],
            ['label' => 'Design builder', 'href' => '/design-builder'],
        ],
    ])
@endsection

@section('home-content')
    @typography(['element' => 'h2', 'variant' => 'h2', 'classList' => ['u-margin__bottom--1']])
        Start exploring
    @endtypography
    @typography(['element' => 'p', 'variant' => 'body', 'classList' => ['u-margin__bottom--3']])
        Choose an area to dive deeper into patterns, components and standards. Each section links directly to living examples and usage guidance.
    @endtypography

    <div class="o-grid o-grid--large">
        <div class="o-grid-12 o-grid-4@md">
            @box([
                'heading' => 'Components',
                'content' => 'A robust library with built-in logic for common scenarios. Browse atoms, molecules and organisms.',
                'link' => '/components',
                'icon' => 'widgets',
            ])
            @endbox
        </div>
        <div class="o-grid-12 o-grid-4@md">
            @box([
                'heading' => 'Utilities',
                'content' => 'Utility mixins to tailor spacing, color and layout without leaving the design system.',
                'link' => '/utilities',
                'icon' => 'tune',
            ])
            @endbox
        </div>
    </div>
@endsection
