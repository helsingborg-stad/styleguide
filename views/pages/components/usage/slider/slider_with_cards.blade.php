@slider([
    'showStepper' => false,
    'autoSlide' => false,
    'attributeList' => [
        'data-slides-per-page' => 4
    ],
])

    @for ($i = 0; $i < 4; $i++)
    
        @slider__item([
            'layout' => 'center',
            'heroStyle' => false,
            'classList' => ['c-slider__item--post']
        ])

            @card([
                'link' => 'https://www.helsingborg.se',
                'image' => ['src' => "https://picsum.photos/seed/$i/267", 'alt' => 'ALT'],
                'heading' => "Card #$i",
                'content' => "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
                'classList' => ['u-color__text--info', 'c-card--focus-inset'],
            ])
            @endcard

        @endslider__item

    @endfor

@endslider
