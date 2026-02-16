@extends('layout.containers.doc')
@section('doc-content')

    @segment([
        'classList' => [
            'p-home__hero'
        ],
        'hasPlaceholder' => false
    ])
        @typography([
            'element' => 'h1',
            'variant' => 'h1',
            'classList' => ['p-home__intro-header']
        ])
        Components
        @endtypography
        @typography([
            'element' => 'p',
            'variant' => 'body'
        ])
        The style guide is intended for websites within Helsingborgs stad and others who use our platform. The guide provides examples, markup and themes for our standardized components. The Helsingborg Styleguide is a flexible and minimalistic component-based framework built in the BEM standard & designed around the Atomic Design principle.
        @endtypography
    @endsegment

    <div class="o-grid o-grid--gutters">
        <div class="o-grid-12 o-grid-4@md">
            @card([
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