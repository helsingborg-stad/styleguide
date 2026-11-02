@slider([
    'autoSlide' => false,
    'title' => 'Explore services',
    'slidesPerPage' => 3,
    'peekSlides' => true,
    'attributeList' => [
        'style' => 'max-width: 32rem;',
    ],
])

    @foreach (['Plan ahead', 'Get help', 'Take action', 'Stay informed'] as $index => $title)
        @slider__item([
            'classList' => ['c-slider__item--post'],
        ])
            @card([
                'link' => 'https://www.getmunicipio.com',
                'image' => [
                    'src' => "https://picsum.photos/seed/compact-slider-$index/640/420",
                    'alt' => '',
                ],
                'heading' => $title,
                'content' => 'A compact slider example with a visible next card.',
            ])
            @endcard
        @endslider__item
    @endforeach

@endslider
