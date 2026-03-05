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
            ['label' => 'Accessibility', 'href' => '/about/accessability'],
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
        <div class="o-grid-12 o-grid-6@md o-grid-3@xl">
            @card([
                'heading' => 'Components',
                'content' => 'A robust library with built-in logic for common scenarios. Browse atoms, molecules and organisms.',
                'image' => [
                    'src' => '/assets/img/component.svg',
                    'alt' => 'Component illustration',
                    'backgroundColor' => 'secondary',
                    'padded' => true
                ],
                'link' => '/components',
                'classList' => ['u-height--100']
            ])
            @endcard
        </div>
        <div class="o-grid-12 o-grid-6@md o-grid-3@xl">
            @card([
                'heading' => 'Atomic design',
                'content' => 'Explore how atoms, molecules and organisms form the backbone of the system.',
                'image' => [
                    'src' => '/assets/img/atom.svg',
                    'alt' => 'Atomic design illustration',
                    'backgroundColor' => 'secondary',
                    'padded' => true
                ],
                'link' => '/about/styleguide-structure',
                'classList' => ['u-height--100']
            ])
            @endcard
        </div>
        <div class="o-grid-12 o-grid-6@md o-grid-3@xl">
            @card([
                'heading' => 'Utilities',
                'content' => 'Utility mixins to tailor spacing, color and layout without leaving the design system.',
                'image' => [
                    'src' => '/assets/img/utility.svg',
                    'alt' => 'Utilities illustration',
                    'backgroundColor' => 'secondary',
                    'padded' => true
                ],
                'link' => '/utilities',
                'classList' => ['u-height--100']
            ])
            @endcard
        </div>
        <div class="o-grid-12 o-grid-6@md o-grid-3@xl">
            @card([
                'heading' => 'Accessibility',
                'content' => 'Guidelines and patterns that keep the experience inclusive across devices.',
                'image' => [
                    'src' => '/assets/img/usability.svg',
                    'alt' => 'Accessibility illustration',
                    'backgroundColor' => 'secondary',
                    'padded' => true
                ],
                'link' => '/about/accessability',
                'classList' => ['u-height--100']
            ])
            @endcard
        </div>
    </div>

    <div class="o-grid o-grid--large u-margin__top--4">
        <div class="o-grid-12 o-grid-6@md">
            @paper(['padding' => 4])
                @typography(['element' => 'h3', 'variant' => 'h3', 'classList' => ['u-margin__bottom--1']])
                    Quick start
                @endtypography
                @typography(['element' => 'p', 'variant' => 'body', 'classList' => ['u-margin__bottom--2']])
                    New to the styleguide? Begin with installation, browse components, then adjust tokens in the design builder.
                @endtypography
                <ul class="u-padding--0 u-margin--0">
                    <li class="u-margin__bottom--1">
                        @link(['href' => '/setup'])
                            Install &amp; configure
                        @endlink
                    </li>
                    <li class="u-margin__bottom--1">
                        @link(['href' => '/components'])
                            Components overview
                        @endlink
                    </li>
                    <li class="u-margin__bottom--1">
                        @link(['href' => '/design-builder'])
                            Experiment with tokens
                        @endlink
                    </li>
                </ul>
            @endpaper
        </div>
        <div class="o-grid-12 o-grid-6@md">
            @paper(['padding' => 4])
                @typography(['element' => 'h3', 'variant' => 'h3', 'classList' => ['u-margin__bottom--1']])
                    Reference library
                @endtypography
                @typography(['element' => 'p', 'variant' => 'body', 'classList' => ['u-margin__bottom--2']])
                    Keep these references close while implementing components and utilities.
                @endtypography
                @tags([
                    'tagsStyle' => 'pill',
                    'tags' => [
                        ['label' => 'Browser support'],
                        ['label' => 'Accessibility'],
                        ['label' => 'Scripts'],
                        ['label' => 'Design tokens'],
                    ]
                ])
                @endtags
            @endpaper
        </div>
    </div>
@endsection
