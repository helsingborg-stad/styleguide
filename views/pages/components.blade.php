@extends('layout.containers.doc')
@section('doc-content')

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
    @slot('main')
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

    @endslot
    @endsegment
    <div class="g-divider g-divider--sm"></div>
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
            Atoms are the fundamental building blocks. They are rarely used just by them self but
            mostly used to build more advanced components.
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
            Molecules
            @endtypography

            @typography([
                'variant' => "p",
                'element' => "p",
                'classList' => ['c-card__text']
            ])
            Molecules are the next level in the Atomic Design System. These are components that bring funtionality and interactive elements to your pages.
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
            Organisms
            @endtypography

            @typography([
                'variant' => "p",
                'element' => "p",
                'classList' => ['c-card__text']
            ])
            Organisms are groups of molecules joined together to form a relatively complex, distinct section of an interface.
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