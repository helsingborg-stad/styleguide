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
        'background_color' => '#ff11ff',
        'height' => 'md',
        'width' => 'lg',
        'content_alignment' => [
            'vertical' => 'center',
            'horizontal' => 'center'
        ],
        'article_heading' => [
            "variant" => "h1",
            "element" => "h2",
            "slot" => "Domesticas me nisi, noctis, comminiscebatur per eventu pede 2 sed nam felis."
        ],
        'article_body' => "Impedimenta dextre etiam 250 magnae cum, novembris e optio sem recordationem quasi communis.",
        //'image' => "https://picsum.photos/id/1012/3973/2639",
        'cta' => array( 
            array(
                'background' => 'secondary',
                'text' => 'Read More',
                'color' => 'white',
                'size' => 'lg'
            ),
            array(
                'background' => 'primary',
                'text' => 'Apply',
                'color' => 'white',
                'size' => 'lg'
            )
        )
    ])

    @endsegment

    @segment([
        'template' => 'split',
        'containContent' => true,
        'height' => 'md',
        'width' => 'lg',
        'content_alignment' => [
            'vertical' => 'bottom',
            'horizontal' => 'left'
        ],
        'article_heading' => [
            "variant" => "h1",
            "element" => "h2",
            "slot" => "Split Domesticas me nisi, noctis, comminiscebatur per eventu pede 2 sed nam felis."
        ],
        'image_focus' => [
            'vertical' => 'center',
            'horizontal' => 'right'
        ],
        'article_body' => "Impedimenta dextre etiam 250 magnae cum, novembris e optio sem recordationem quasi communis.",
        'image' => "https://picsum.photos/id/1012/3973/2639",
        'cta' => array( 
            array(
                'href' => '#',
                'text' => 'Apply',
                'size' => 'lg'
            ),
            array(
                'href' => '#',
                'text' => 'Read more',
                'isOutlined' => true,
                'size' => 'lg'
            )
        )
    ])

    @endsegment

    @segment([
        'template' => 'split',
        'containContent' => true,
        'reverse_layout' => true,
        'card' => [
            'isCard' => true,
            'background' => "white",
            'padding' => "0"
        ],
        'height' => 'md',
        'width' => 'lg',
        'content_alignment' => [
            'vertical' => 'center',
            'horizontal' => 'left'
        ],
        'article_heading' => [
            "variant" => "h1",
            "element" => "h2",
            "slot" => "Split contain Domesticas me nisi, noctis, comminiscebatur per eventu pede 2 sed nam felis."
        ],
        'image_focus' => [
            'vertical' => 'center',
            'horizontal' => 'right'
        ],
        'article_body' => "Impedimenta dextre etiam 250 magnae cum, novembris e optio sem recordationem quasi communis.",
        'image' => "https://picsum.photos/id/1012/3973/2639",
        'cta' => array( 
            array(
                'href' => '#',
                'text' => 'Apply',
                'size' => 'lg'
            ),
            array(
                'href' => '#',
                'text' => 'Read more',
                'isOutlined' => true,
                'size' => 'lg'
            )
        )
    ])

    @endsegment

    @segment([
        'template' => 'featured',
        'containContent' => true,
        'height' => 'md',
        'width' => 'lg',
        'text_alignment' => 'center',
        'content_alignment' => [
            'vertical' => 'center',
            'horizontal' => 'right'
        ],
        'article_heading' => [
            "variant" => "h1",
            "element" => "h2",
            "slot" => "Here is some featured content!"
        ],
        'image_focus' => [
            'vertical' => 'center',
            'horizontal' => 'right'
        ],
        'article_body' => "Let us tell you about something. Something is so awesome and so cool that I can't tell you more. But checkout the components and cta's!",
        'cta' => array( 
            array(
                'href' => '#',
                'text' => 'Read more',
                'isOutlined' => true,
                'size' => 'lg'
            ),
            array(
                'href' => '#',
                'text' => 'Read more',
                'isOutlined' => true,
                'size' => 'lg'
            )
        )
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
        'template' => 'featured',
        'containContent' => true,
        'height' => 'md',
        'width' => 'lg',
        'card' => [
            'isCard' => true,
            'background' => "white",
            'padding' => "10"
        ],
        'text_alignment' => 'right',
        'content_alignment' => [
            'vertical' => 'center',
            'horizontal' => 'right'
        ],
        'article_heading' => [
            "variant" => "h1",
            "element" => "h2",
            "slot" => "Here is some featured content!"
        ],
        'image_focus' => [
            'vertical' => 'center',
            'horizontal' => 'right'
        ],
        'article_body' => "Let us tell you about something. Something is so awesome and so cool that I can't tell you more. But checkout the components and cta's!",
        'cta' => array( 
            array(
                'href' => '#',
                'text' => 'Read more',
                'isOutlined' => true,
                'size' => 'lg'
            ),
            array(
                'href' => '#',
                'text' => 'Read more',
                'isOutlined' => true,
                'size' => 'lg'
            )
        )
    ])

    @endsegment
@stop
