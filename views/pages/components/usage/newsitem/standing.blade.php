@newsItem([
    'heading'             => "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    'content'             => "This is a short excerpt of the news item for demonstration purposes. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vel sapien augue. Donec vel sapien augue.",
    'image'               => null,
    'date'                => true ? [
        'timestamp' => time(),
        'format'    => 'Y-m-d',
    ] : null,
    'readTime'            => '5 minutes',
    'link'                => 'https://example.com/fake-news-item',
    'hasPlaceholderImage' => true,
    'standing' => true
])
    @slot('headerLeftArea')
        
            @typography([
                'element' => 'span',
                'variant' => 'bold',
                'classList' => ['u-margin__y--0', 'u-padding__right--1'],
            ])
                A site name
            @endtypography

            @tags([
                'compress' => 4, 
                'tags' => [], 
                'format' => false,
            ])
            @endtags

    @endslot

    @slot('headerRightArea')
       
    @endslot
@endnewsItem
