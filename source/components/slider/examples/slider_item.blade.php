@slider([
    'showStepper' => true,
    'autoSlide' => false,
])
    @slider__item([
        'title' => 'Base Layout',
        'text' => 'Here I could put some lorem ipsum text but I am too lazy to Google for one so I wrote all this instead. Woo!',
        'layout' => 'center',
        'containerColor' => 'darkest',
        'image' => 'https://picsum.photos/1080/720',
        'heroStyle' => true,
        'cta' => [
            'title' => 'Read more',
            'href' => 'https://www.helsingborg.se',
        ]
    ])
    @endslider__item

    @slider__item([
        'title' => 'Base Layout',
        'text' => 'Here I could put some lorem ipsum text but I am too lazy to Google for one so I wrote all this instead. Woo!',
        'layout' => 'bottom',
        'containerColor' => 'darkest',
        'image' => 'https://picsum.photos/1080/720',
        'cta' => [
            'title' => 'Read more',
            'href' => 'https://www.helsingborg.se',
        ]
    ])
    @endslider__item

    @slider__item([
        'title' => 'Base Layout',
        'text' => 'Here I could put some lorem ipsum text but I am too lazy to Google for one so I wrote all this instead. Woo!',
        'layout' => 'center',
        'containerColor' => 'transparent',
        'image' => 'https://picsum.photos/1080/720',
        'overlay' => 'light',
    ])
    @endslider__item

    @slider__item([
        'title' => 'Base Layout',
        'text' => 'Here I could put some lorem ipsum text but I am too lazy to Google for one so I wrote all this instead. Woo!',
        'layout' => 'bottom',
        'containerColor' => 'lightest',
        'image' => 'https://picsum.photos/1080/720',
        'video' => 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    ])
    @endslider__item

    @slider__item([
        'title' => 'Base Layout',
        'text' => 'Here I could put some lorem ipsum text but I am too lazy to Google for one so I wrote all this instead. Woo!',
        'containerColor' => 'darkest',
        'layout' => 'center',
    ])
    @endslider__item
@endslider
