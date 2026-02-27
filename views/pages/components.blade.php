@extends('layout.containers.doc')

@section('doc-hero')
    @include('layout.partials.doc-hero', [
        'title' => 'Component library',
        'subtitle' => 'Browse atoms, molecules and organisms with ready-made markup and guidance.',
        'metaTags' => [
            ['label' => 'Structured by atomic design'],
            ['label' => 'Reusable Blade components']
        ],
        'primaryCta' => ['label' => 'Start with atoms', 'href' => '/components/atoms'],
        'secondaryCta' => ['label' => 'View organisms', 'href' => '/components/organisms'],
        'shortcuts' => [
            ['label' => 'Atoms', 'href' => '/components/atoms'],
            ['label' => 'Molecules', 'href' => '/components/molecules'],
            ['label' => 'Organisms', 'href' => '/components/organisms'],
            ['label' => 'Icons', 'href' => '/icons'],
        ],
    ])
@endsection

@section('doc-content')
    @typography(['element' => 'h2', 'variant' => 'h2', 'classList' => ['u-margin__bottom--1']])
        Browse by level
    @endtypography
    @typography(['element' => 'p', 'variant' => 'body', 'classList' => ['u-margin__bottom--3']])
        Components are grouped to make discovery predictable. Select a level to open examples, code snippets and parameters.
    @endtypography

    <div class="o-grid o-grid--gutters">
        <div class="o-grid-12 o-grid-4@md">
            @card([
                'heading' => 'Atoms',
                'content' => 'Foundational building blocks such as buttons, tags and typography.',
                'image' => '/assets/img/atom.svg',
                'hasPlaceholder' => true,
                'buttons' => [
                    [
                        'type' => 'outlined',
                        'text' => 'Go to atoms',
                        'color' => 'primary',
                        'href' => '/components/atoms'
                    ]
                ]
            ])
            @endcard
        </div>
        <div class="o-grid-12 o-grid-4@md">
            @card([
                'heading' => 'Molecules',
                'content' => 'Compositions of atoms that solve common interface tasks.',
                'image' => '/assets/img/molecule.svg',
                'hasPlaceholder' => true,
                'buttons' => [
                    [
                        'type' => 'outlined',
                        'text' => 'Go to molecules',
                        'color' => 'primary',
                        'href' => '/components/molecules'
                    ]
                ]
            ])
            @endcard
        </div>
        <div class="o-grid-12 o-grid-4@md">
            @card([
                'heading' => 'Organisms',
                'content' => 'Full sections and templates that include interactions and layout.',
                'image' => '/assets/img/organisms.svg',
                'hasPlaceholder' => true,
                'buttons' => [
                    [
                        'type' => 'outlined',
                        'text' => 'Go to organisms',
                        'color' => 'primary',
                        'href' => '/components/organisms'
                    ]
                ]
            ])
            @endcard
        </div>
    </div>

@stop