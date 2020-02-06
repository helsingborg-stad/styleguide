@extends('layout.master')

@section('hero')
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
            Components
        @endtypography
        @typography([
            'element' => 'p',
            'variant' => 'body'
        ])        
            The style guide is intended for websites within Helsingborgs stad and others who use our platform. The guide provides examples, markup and themes for our standardized components. The Helsingborg Styleguide is a flexible and minimalistic component-based framework built in the BEM standard & designed around the Atomic Design principle.
        @endtypography
        <div class="g-divider--lg"></div>
    @endslot
@endsegment

@segment([
        'template' => 'full',
        'contain_content' => true,
        'height' => 'sm',
        'width' => 'lg',
        'padding' => 0,
        'text_alignment' => 'left',
        'content_alignment' => [
            'vertical' => 'center',
            'horizontal' => 'center'
        ],
        'heading' => "Atomic design",
        'body' => "We based our component structure on the Atmoic Design System. This allows us to build components with a deliberate goal.
        The Atomic Design System give structure to the components by organising them in three different levels: Atoms, Molecules and Organisms.",
        'classList' => ['p-home__hero']
    ])
    @endsegment
@endsection

@section('content')
    <div class="p-component__atomic">
        <div class="p-component__atomic__image">
            @image([
            'src'=> '/assets/img/atom.svg',
            'alt' => 'atom'
            ])
            @endimage
        </div>
        <div class="p-component__atomic__body">
            @typography([
                'element' => 'h2',
                'variant' => 'h2'
            ])
                Atoms
            @endtypography

            @typography([
                    'variant' => "p",
                    'element' => "p",
                    'classList' => ['c-card__text']
                ])
            Atoms are the fundemental building blocks. They are rarely used just by them self but mostly used to build more advanced components.
            @endtypography

            <p>
                @button([
                    'type' => 'outlined',
                    'text' => 'Go to',
                    'color' => 'primary'
                ])
                @endbutton
            </p>
            
        </div>
    </div>

    <div class="p-component__atomic">
        <div class="p-component__atomic__body">
            @typography([
                'element' => 'h2',
                'variant' => 'h2'
            ])
                Atoms
            @endtypography

            @typography([
                    'variant' => "p",
                    'element' => "p",
                    'classList' => ['c-card__text']
                ])
            Atoms are the fundemental building blocks. They are rarely used just by them self but mostly used to build more advanced components.
            @endtypography

            <p>
                @button([
                    'type' => 'outlined',
                    'text' => 'Go to',
                    'color' => 'primary'
                ])
                @endbutton
            </p>
            
        </div>
        <div class="p-component__atomic__image">
            @image([
            'src'=> '/assets/img/molecule.svg',
            'alt' => 'atom'
            ])
            @endimage
        </div>
    </div>

    <div class="p-component__atomic">
        <div class="p-component__atomic__image">
            @image([
            'src'=> '/assets/img/organisms.svg',
            'alt' => 'atom'
            ])
            @endimage
        </div>
        <div class="p-component__atomic__body">
            @typography([
                'element' => 'h2',
                'variant' => 'h2'
            ])
                Molecules
            @endtypography

            @typography([
                    'variant' => "p",
                    'element' => "p",
                    'classList' => ['c-card__text']
                ])
            Atoms are the fundemental building blocks. They are rarely used just by them self but mostly used to build more advanced components.
            @endtypography

            <p>
                @button([
                    'type' => 'outlined',
                    'text' => 'Go to',
                    'color' => 'primary'
                ])
                @endbutton
            </p>
            
        </div>
    </div>
@stop
