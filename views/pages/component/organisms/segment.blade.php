@extends('layout.master')

@section('content')
    {!!
        markdown('
            #Segments (sections)

            The sections componet are specifically build to contain other components. The component creates a full-page container with a layout. It will work as long as the current container is centered. The component automatically bleeds beyond the container.
        ')
    !!}

@endsection

@section('hero')

    @segment([
        'template' => 'full',
        'height' => 'lg',
        'parallax' => true,
        'background_image' => "https://picsum.photos/id/1012/3973/2639",
        'content_alignment' => [
            'vertical' => 'center',
            'horizontal' => 'center'
        ],
        'heading' => "Domesticas me nisi, noctis, comminiscebatur per eventu pede 2 sed nam felis.",
        'body' => "Impedimenta dextre etiam 250 magnae cum, novembris e optio sem recordationem quasi communis.",
        'cta' => [
            [

                'type' => 'filled',
                'color' => 'primary',
                'text' => 'Read More',
                'size' => 'lg'
            ],
            [
                'type' => 'filled',
                'color' => 'primary',
                'text' => 'Apply',
                'size' => 'lg'
            ]
        ]
    ])

    @endsegment

    @segment([
        'template' => 'split',
        'contain_content' => true,
        'height' => 'sm',
        'content_alignment' => [
            'vertical' => 'bottom',
            'horizontal' => 'left'
        ],
        'heading' => "Split Domesticas me nisi, noctis, comminiscebatur per eventu pede 2 sed nam felis.",
        'image_focus' => [
            'vertical' => 'top',
            'horizontal' => 'right'
        ],
        'body' => "Impedimenta dextre etiam 250 magnae cum, novembris e optio sem recordationem quasi communis.",
        'image' => "https://picsum.photos/id/1012/3973/2639",
        'cta' => [
            [
                'type' => 'filled',
                'color' => 'primary',
                'href' => '#',
                'text' => 'Apply',
                'size' => 'lg'
            ],
            [
                'type' => 'filled',
                'color' => 'primary',
                'href' => '#',
                'text' => 'Read more',
                'isOutlined' => true,
                'size' => 'lg'
            ]
        ]
    ])

    @endsegment

    @segment([
        'template' => 'split',
        'contain_content' => true,
        'reverse_layout' => true,
        'contain_content' => false,
        'padding' => 0,
        'height' => 'md',
        'content_alignment' => [
            'vertical' => 'center',
            'horizontal' => 'left'
        ],
        'heading' => "Split contain Domesticas me nisi, noctis, comminiscebatur per eventu pede 2 sed nam felis.",
        'image_focus' => [
            'vertical' => 'center',
            'horizontal' => 'right'
        ],
        'body' => "Impedimenta dextre etiam 250 magnae cum, novembris e optio sem recordationem quasi communis.",
        'image' => "https://picsum.photos/id/1012/3973/2639",
        'cta_align' => 'apart',
        'cta' => [
            [
                'href' => '#',
                'type' => 'filled',
                'text' => 'Apply',
                'size' => 'lg'
            ],
            [
                'type' => 'filled',
                'color' => 'primary',
                'href' => '#',
                'text' => 'Read more',
                'isOutlined' => true,
                'size' => 'lg'
            ]
        ]
    ])

    @endsegment

    @segment([
        'template' => 'featured',
        'contain_content' => true,
        'height' => 'md',
        'text_alignment' => 'center',
        'content_alignment' => [
            'vertical' => 'center',
            'horizontal' => 'right'
        ],
        'heading' => "Here is some featured content!",
        'image_focus' => [
            'vertical' => 'center',
            'horizontal' => 'right'
        ],
        'body' => "Let us tell you about something. Something is so awesome and so cool that I can't tell you more. But checkout the components and cta's!",
        'cta_align' => 'center',
        'cta' => [
            [
                'type' => 'outlined',
                'color' => 'primary',
                'href' => '#',
                'text' => 'Read more',
                'isOutlined' => true,
                'size' => 'lg'
            ],
            [
                'type' => 'filled',
                'color' => 'secondary',
                'href' => '#',
                'text' => 'Read more',
                'isOutlined' => true,
                'size' => 'lg'
            ]
        ]
    ])
        <div class="grid">

            <div class="grid-s-12 grid-sm-6 grid-md-6">
                @card([
                    'href' => 'http://styleguide.helsingborg.se/card',
                    'image' => 'https://picsum.photos/300/200?image=1016',
                    'title' => ['text' => 'Melon sierra leone bologi rutabaga', 'position' => 'top'],
                    'byline' => ['text' => 'Celery quandong swiss chard chicory', 'position' => 'top'],
                    'classList' => ['c-card--shadow-on-hover'],
                    'content' => 'Sea lettuce gumbo grape kale kombu cauliflower salsify kohlrabi okra sea lettuce
                                    broccoli celery lotus root carrot winter purslane turnip greens garlic. ',
                    'hasRipple' => false
                ])

                @endcard

            </div>

            <div class="grid-s-12 grid-sm-6 grid-md-6">
                @card([
                    'href' => 'http://styleguide.helsingborg.se/card',
                    'image' => 'https://picsum.photos/300/200?image=1071',
                    'title' => ['text' => 'Cheddar ricotta croque monsieur', 'position' => 'body'],
                    'classList' => ['c-card--shadow-on-hover'],
                    'byline' => ['text' => 'Melted cheese camembert de normandie cheese triangles', 'position' => 'body'],
                    'content' => 'Blue castello red leicester camembert de normandie. Swiss cheeseburger taleggio cheesy
                            feet who moved my cheese airedale mozzarella boursin. ',
                    'hasRipple' => false

                ])

                @endcard

            </div>
        </div>
    @endsegment

    @segment([
        'template' => 'card',
        'background_color' => 'white',
        'heading' => "Here is some featured content!",
        'contain_content' => true,
        'height' => 'md',
        'padding' => "1",
        'paralax' => true,
        'text_alignment' => 'center',
        'content_alignment' => [
            'vertical' => 'center',
            'horizontal' => 'center'
        ],
        'image_focus' => [
            'vertical' => 'center',
            'horizontal' => 'right'
        ],
        'body' => "Let us tell you about something. Something is so awesome and so cool that I can't tell you more. But checkout the components and cta's!",
        'cta_align' => 'center',
        'cta' => [ 
            [
                'type' => 'filled',
                'color' => 'secondary',
                'href' => '#',
                'text' => 'Read more',
                'isOutlined' => true,
                'size' => 'lg'
            ],
            [
                'type' => 'filled',
                'color' => 'primary',
                'href' => '#',
                'text' => 'Read more',
                'isOutlined' => true,
                'size' => 'lg'
            ]
        ]
    ])

    @endsegment
@stop
