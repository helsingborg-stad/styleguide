@slider([
    'background' => 'primary',
    'text' => 'Primary bg',
    'color' => 'white'
])
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
                'text' => 'Read more...',
                'type' => 'basic',
                'color' => 'primary',
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
        'card' => [
            'isCard' => true,
            'background' => "white",
            'padding' => "10"
        ],
        'text_alignment' => 'left',
        'content_alignment' => [
            'vertical' => 'center',
            'horizontal' => 'left'
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
                'text' => 'Read less',
                'isOutlined' => true,
                'type' => 'outlined',
                'color' => 'primary',
                'size' => 'lg'
            ),
            array(
                'href' => '#',
                'text' => 'Read more',
                'type' => 'outlined',
                'color' => 'secondary',
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
        'card' => [
            'isCard' => true,
            'background' => "white",
            'padding' => "10"
        ],
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
                'text' => 'More info...',
                'color' => 'primary',
                'type' => 'filled',
                'size' => 'lg',
                'background' => 'default'
            ),
        )
    ])

    @endsegment
@endslider
