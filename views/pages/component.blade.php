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
    'heading' => "Helsingborgs Stad",
    'classList' => [
        'p-home__hero'
    ]

])
    @slot('body')

        <div class="p-home__intro-subtitle"></div>
        <div class="c-footer__link-divider"></div>
        @typography([
            'element' => 'p',
            'variant' => 'body'
        ])        
            The style guide is intended for websites within Helsingborgs stad and others who use our platform. The guide provides examples, markup and themes for our standardized components. The Helsingborg Styleguide is a flexible and minimalistic component-based framework built in the BEM standard & designed around the Atomic Design principle.
        @endtypography
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
    @segment([
        'template' => 'card',
        'contain_content' => true,
        'reverse_layout' => true,
        'background_color' => 'grey',
        'padding' => 0,
        'width' => 'sm',
        'content_alignment' => [
            'vertical' => 'center',
            'horizontal' => 'left'
        ],
        'heading' => "Atoms",
        'body' => "Atoms are the fundemental building blocks. They are rarely used just by them self but mostly used to build more advanced components.",
        'image' => "https://images.unsplash.com/photo-1531956656798-56686eeef3d4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=956&q=80",
        'cta' => [
            [
                'href' => 'component/atoms',
                'text' => 'See our atoms',
                'isOutlined' => true,
                'type' => 'filled',
                'color' => 'primary',
                'size' => 'lg'
            ]
        ],
        'classList' => ['u-margin__bottom--5', 'p-components__segment']
    ])

    @endsegment

    @segment([
        'template' => 'split',
        'contain_content' => true,
        'background_color' => 'white',
        'padding' => 0,
        'content_alignment' => [
            'vertical' => 'center',
            'horizontal' => 'left'
        ],
        'heading' => "Molecules",
        'body' => "Molecules are the next level in the Atomic Design System. These are components that bring funtionality and interactive elements to your pages.",
        'image' => "https://images.unsplash.com/photo-1557511560-d07d5f64fd59?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80",
        'cta' => [
            [
                'href' => 'component/atoms',
                'text' => 'See our molecules',
                'isOutlined' => true,
                'type' => 'filled',
                'color' => 'primary',
                'size' => 'lg'
            ]
        ],
        'classList' => ['u-margin__bottom--5']
    ])

    @endsegment

    @segment([
        'template' => 'split',
        'contain_content' => true,
        'reverse_layout' => true,
        'background_color' => 'white',
        'padding' => 0,
        'content_alignment' => [
            'vertical' => 'center',
            'horizontal' => 'left'
        ],
        'heading' => "Organisms",
        'body' => "Organisms are the final level of our Atomic Design System. These components mostly acts as containers for Atoms and Molecules.",
        'image' => "https://images.unsplash.com/photo-1535127022272-dbe7ee35cf33?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80",
        'cta' => [
            [
                'href' => 'component/atoms',
                'text' => 'See our organisms',
                'type' => 'filled',
                'color' => 'primary',
                'size' => 'lg'
            ]
        ],
        'classList' => ['u-margin__bottom--5']
    ])

    @endsegment
@stop
