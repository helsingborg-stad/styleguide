@segment([
    'template' => 'featured',
    'containContent' => true,
    'height' => 'md',
    'width' => 'lg',
    'card' => [
        'isCard' => true,
        'background' => "gray",
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
        "slot" => ""
    ],
    'article_body' => ""
])
    @comment([
        'author' => 'Peter Svensson',
        'author_url' => '#',
        'text' => 'This is a comment text',
        'icon' => 'face',
        'date' => '2019-12-01 17:25:43'
    ])
    @endcomment

    @comment([
        'author' => 'Peter Olsson',
        'text' => 'This is a reply comment text',
        'icon' => 'face',
        'author_image' => 'https://picsum.photos/70/70?image=64',
        'date' => '2020-01-01 17:25:43',
        'is_reply' => true
    ])
    @endcomment

    @comment([
        'author' => 'Peter Svensson',
        'date' => '2020-01-09 17:25:43'
    ])
        This comment was sent through the slot
    @endcomment

@endsegment