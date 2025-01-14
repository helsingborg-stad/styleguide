@extends('layout.containers.home')
@section('home-content')

@segment([
    'height' => 'sm',
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
        Helsingborg Stad
    @endtypography
    <div class="p-home__intro-subtitle">
        @typography([
            'element' => 'h2',
            'variant' => 'h2',
            'classList' => ['p-home__intro-subtitle__part']
        ])
            Styleguide
        @endtypography
        <div class="p-home__intro-subtitle__divider"></div>
        @typography([
            'element' => 'h2',
            'variant' => 'h2',
            'classList' => ['p-home__intro-subtitle__part']
        ])
            Version 2.0
        @endtypography
    </div>
    @typography([
        'element' => 'p',
        'variant' => 'body'
    ])        
        The style guide is intended for websites within Helsingborgs stad and others who use our platform. The guide provides examples, markup and themes for our standardized components. The Helsingborg Styleguide is a flexible and minimalistic component-based framework built in the BEM standard & designed around the Atomic Design principle.
    @endtypography
@endsegment

<article class="o-container">
    <div class="o-grid">
        <div class="o-grid-6@md o-grid-3@lg o-grid-3@xl">
            @card([
                'heading' => 'Components',
                'subHeading' => 'A web for everyone',
                'content' => 'The component library is a collection of robust views with built-in logic to handle common scenarios.',
                'image' => [
                    'src' => '/assets/img/component.svg',
                    'alt' => 'ALT',
                    'backgroundColor' => 'secondary',
                    'padded' => true
                ],
                'link' => '/components',
                'classList' => ['u-height--100']
            ])
            @endcard
        </div>
        <div class="o-grid-6@md o-grid-3@lg o-grid-3@xl">
            @card([
                'heading' => 'Atomic Design',
                'subHeading' => 'Implemented standards',
                'content' => 'The Atomic Design System give structure to the components by organising them in three different levels: Atoms, Molecules and Organisms.',
                'image' => [
                    'src' => '/assets/img/atom.svg',
                    'alt' => 'ALT',
                    'backgroundColor' => 'secondary',
                    'padded' => true
                ],
                'link' => '/about/styleguide-structure',
                'classList' => ['u-height--100']
            ])
            @endcard
        </div>
        <div class="o-grid-6@md o-grid-3@lg o-grid-3@xl">
            @card([
                'heading' => 'Utilities',
                'subHeading' => 'Behind the screen',
                'content' => 'Swiftly create new apperance of anything in the styleguide, or even create a new component. Each utility has their corresponding mixin.',
                'image' => [
                    'src' => '/assets/img/utility.svg',
                    'alt' => 'ALT',
                    'backgroundColor' => 'secondary',
                    'padded' => true
                ],
                'link' => '/utilities',
                'classList' => ['u-height--100']
            ])
            @endcard
        </div> 
        <div class="o-grid-6@md o-grid-3@lg o-grid-3@xl">
            @card([
                'heading' => 'Accessibility',
                'subHeading' => 'And usability',
                'content' => 'One of the main focus of this styleguide is usability. Read more of our guidelines here.',
                'image' => [
                    'src' => '/assets/img/usability.svg',
                    'alt' => 'ALT',
                    'backgroundColor' => 'secondary',
                    'padded' => true
                ],
                'link' => '/about/accessability',
                'classList' => ['u-height--100']
            ])
            @endcard
        </div>
    </div>
</article>
@stop
