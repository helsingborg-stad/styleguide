@extends('layout.containers.home')
@section('home-content')

@segment([
    'template' => 'full',
    'height' => 'sm',
    'parallax' => true,
    'background_color' => '#E5E5E5',
    'text_alignment' => 'left',
    'cta_align' => 'center',
    'color' => 'secondary',
    'content_alignment' => [
        'vertical' => 'center',
        'horizontal' => 'center'
    ],
    'classList' => [
        'p-home__hero',
        ''
    ]

])
    @slot('main')
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
    @endslot

    @slot('bottom')
        You can easily get started by including our CSS and JavaScript from our GitHub CDN. For the advanced user who wants to customize our code, please refer to the source files in our styleguide at https://github.com/helsingborg-stad/styleguide.
    @endslot
@endsegment



<article>
    @grid([
        "container" => true,
        "columns" => "auto-fit",
        "min_width" => "280px",
        "max_width" => "280px",
        "col_gap" => 2,
        "row_gap" => 2,
        "classList" => [
            "u-justify-content--center"
        ]
    ])
        @grid([])
            @card([
                'heading' => 'Components',
                'subHeading' => 'A web for everyone',
                'imageFirst' => true,
                'content' => 'The component library is a collection of robust views with built-in logic to handle common scenarios.',
                'image' => [
                    'src' => '/assets/img/component.svg',
                    'alt' => 'ALT',
                    'backgroundColor' => 'secondary',
                    'padded' => true
                ],
                'buttons' => [
                    ['href' => '/components', 'type' => 'outlined', 'color' => 'primary', 'text' => 'Go to'],
                ],
                'classList' => ['u-height--100']
            ])
            @endcard
        @endgrid

        @grid([])
            @card([
                'heading' => 'Atomic Design',
                'subHeading' => 'A wide variaty of components',
                'imageFirst' => true,
                'content' => 'The Atomic Design System give structure to the components by organising them in three different levels: Atoms, Molecules and Organisms.',
                'image' => [
                    'src' => '/assets/img/atom.svg',
                    'alt' => 'ALT',
                    'backgroundColor' => 'secondary',
                    'padded' => true
                ],
                'buttons' => [
                    ['href' => '/components', 'type' => 'outlined', 'color' => 'primary', 'text' => 'Go to'],
                ],
                'classList' => ['u-height--100']
            ])
            @endcard
        @endgrid

        @grid([])
            @card([
                'heading' => 'Utilities',
                'subHeading' => 'Behind the screen',
                'imageFirst' => true,
                'content' => 'Swiftly create new apperance of anything in the styleguide, or even create a new component. Each utility has their corresponding mixin.',
                'image' => [
                    'src' => '/assets/img/utility.svg',
                    'alt' => 'ALT',
                    'backgroundColor' => 'secondary',
                    'padded' => true
                ],
                'buttons' => [
                    ['href' => '/utilities', 'type' => 'outlined', 'color' => 'primary', 'text' => 'Go to'],
                ],
                'classList' => ['u-height--100']
            ])
            @endcard
        @endgrid

        @grid([])
            @card([
                'heading' => 'Usability',
                'subHeading' => 'Behind the screen',
                'imageFirst' => true,
                'content' => 'One of the main focus of this styleguide is usability. Read more of our guidelines here.',
                'image' => [
                    'src' => '/assets/img/usability.svg',
                    'alt' => 'ALT',
                    'backgroundColor' => 'secondary',
                    'padded' => true
                ],
                'buttons' => [
                    ['href' => '#', 'type' => 'outlined', 'color' => 'primary', 'text' => 'Go to'],
                ],
                'classList' => ['u-height--100']
            ])
            @endcard
        @endgrid
    @endgrid

</article>
    @segment([
        'template' => 'full',
        'height' => 'md',
        'parallax' => true,
        'background_color' => '#E5E5E5',
        'text_alignment' => 'left',
        'cta_align' => 'center',
        'color' => 'secondary',
        'content_alignment' => [
            'vertical' => 'center',
            'horizontal' => 'center'
        ],
        'heading' => "Latest Updates",
        'classList' => [
            'p-home__hero'
        ]

    ])
        @slot('main')
            <div class="p-home__update">
                @typography([
                    'element' => 'p',
                    'variant' => 'meta'
                ])
                    Feb 03, 2020
                @endtypography
    
                @typography([
                    'element' => 'h3',
                    'variant' => 'h3'
                ])
                    Updates will be showing here
                @endtypography
    
                @typography([
                    'element' => 'p',
                    'variant' => 'body'
                ])
                    This is just a placeholder, real updates will be showing here soon.
                @endtypography
            </div>
            {{-- @foreach ($updates as $update)
            <div class="p-home__update">
                @typography([
                    'element' => 'p',
                    'variant' => 'meta'
                ])
                {{$update['date']}}
                @endtypography
    
                @typography([
                    'element' => 'h3',
                    'variant' => 'h3'
                ])
                Updates will be showing here
                @endtypography
    
                @typography([
                    'element' => 'p',
                    'variant' => 'body'
                ])
                    {{$update['message']}}
                @endtypography
                </div>
            @endforeach --}}
            

            
        @endslot
    @endsegment
@stop


