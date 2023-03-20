@slider([
    'showStepper' => false,
    'autoSlide' => false,
    'repeatSlide' => false,
    'attributeList' => [
        'data-slides-per-page' => 1
    ],
    'classList' => ['c-slider--post']
])

    @for ($i = 0; $i < 4; $i++)
    
        @slider__item([
            'classList' => ['c-slider__item--post']
        ])

            @segment([
                'layout' => 'card',
                'title' => "Card #$i",
                'tags' => false,
                'meta' => false,
                'image' => "https://picsum.photos/seed/$i/267",
                'buttons' => [['text' => 'Read More', 'href' => 'https://www.helsingborg.se']],
                'content' => "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
                'classList' => ['c-segment--slider', 'c-segment--size-sm'],
                'containerAware' => true,
                'reverseColumns' => true
            ])
            @endsegment

        @endslider__item

    @endfor

@endslider
