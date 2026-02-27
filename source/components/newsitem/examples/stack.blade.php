@for($i = 1; $i <= 3; $i++)

    @newsItem([
        'heading'             => "Stack 1",
        'content'             => "This is a short excerpt of the news item for demonstration purposes.",
        'image'               => null,
        'date'                => true ? [
            'timestamp' => strtotime('2024-06-01'),
            'format'    => 'Y-m-d',
        ] : null,
        'readTime'            => '5 minutes',
        'link'                => 'https://example.com/fake-news-item',
        'context'             => ['module.posts.news-item'],
        'hasPlaceholderImage' => true,
        'classList' => [],
        'standing' => false,
        'attributeList' => [],
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
@endfor