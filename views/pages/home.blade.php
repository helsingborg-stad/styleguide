@extends('layout.containers.home')
@section('home-content')

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
    'classList' => [
        'p-home__hero'
    ]

])
    @slot('body')
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
@endsegment



<article>

    <div class="grid p-home__cards" data-equal-container>
        <div class="grid-xs-12 grid-md-12">
            @segment([
                'template' => 'full',
                'height' => 'sm',
                'parallax' => true,
                'background_color' => 'white',
                'text_alignment' => 'left',
                'cta_align' => 'center',
                'color' => 'white',
                'content_alignment' => [
                    'vertical' => 'center',
                    'horizontal' => 'center'
                ],
                'heading' => "Getting Started",
                'subtitle' => 'lol',
                'classList' => [
                    'p-home__hero',
                    'p-home__getting-started'
                ]

            ])
                @slot('body')
                You can easily get started by including our CSS and JavaScript from our GitHub CDN. For the advanced user who wants to customize our code, please refer to the source files in our styleguide at https://github.com/helsingborg-stad/styleguide.
                @endslot
            @endsegment

        </div>
        <div class="grid-xs-12 grid-md-3">
            @card([
                'href' => '#',
                'image' => '/assets/img/component.svg',
                'title' => ['text' => 'Components', 'position' => 'body'],
                'byline' => ['text' => 'A web for everyone', 'position' => 'top'],
                'classList' => ['c-card--shadow-on-hover'],
                'content' => 'The component library is a collection of robust views with built-in logic to handle common scenarios.',
                'hasRipple' => false,
                'buttons' => [
                    [
                        'href' => '/component',
                        'text' => 'Go to',
                        'attributeList' => ['js-toggle-trigger'],
                        'color' => 'primary',
                        'type' => 'outlined'
                    ]
                ]
            ])

            @endcard
        </div>

        <div class="grid-xs-12 grid-md-3">
            @card([
                'href' => '#',
                'image' => '/assets/img/atom.svg',
                'title' => ['text' => 'Atomic Design', 'position' => 'body'],
                'byline' => ['text' => 'A wide variaty of components', 'position' => 'top'],
                'classList' => ['c-card--shadow-on-hover'],
                'content' => 'The Atomic Design System give structure to the components by organising them in three different levels: Atoms, Molecules and Organisms.',
                'hasRipple' => false,
                'buttons' => [
                    [
                        'href' => '/component',
                        'text' => 'Go to',
                        'attributeList' => ['js-toggle-trigger'],
                        'color' => 'primary',
                        'type' => 'outlined'
                    ]
                ]
            ])

            @endcard
        </div>

        <div class="grid-xs-12 grid-md-3">
            @card([
                'href' => '#',
                'image' => '/assets/img/utility.svg',
                'title' => ['text' => 'Utilities', 'position' => 'body'],
                'byline' => ['text' => 'Behind the screen', 'position' => 'top'],
                'classList' => ['c-card--shadow-on-hover'],
                'content' => 'Swiftly create new apperance of anything in the styleguide, or even create a new component. Each utility has their corresponding mixin.',
                'hasRipple' => false,
                'buttons' => [
                    [
                        'href' => '/utilities',
                        'text' => 'Go to',
                        'attributeList' => ['js-toggle-trigger'],
                        'color' => 'primary',
                        'type' => 'outlined'
                    ]
                ]
            ])

            @endcard
        </div>
        <div class="grid-xs-12 grid-md-3">
            @card([
                'href' => '#',
                'image' => '/assets/img/usability.svg',
                'title' => ['text' => 'Usability', 'position' => 'body'],
                'byline' => ['text' => 'Behind the screen', 'position' => 'top'],
                'classList' => ['c-card--shadow-on-hover'],
                'content' => 'One of the main focus of this styleguide is usability. Read more of our guidelines here.',
                'hasRipple' => false,
                'buttons' => [
                    [
                        'href' => '/usability',
                        'text' => 'Go to',
                        'attributeList' => ['js-toggle-trigger'],
                        'color' => 'primary',
                        'type' => 'outlined'
                    ]
                ]
            ])

            @endcard
        </div>

    </div>

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
        @slot('body')
            @foreach ($updates as $update)
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
            @endforeach
            

            
        @endslot
    @endsegment
@stop


