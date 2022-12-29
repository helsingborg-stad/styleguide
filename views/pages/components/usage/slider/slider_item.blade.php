@slider([
    'showStepper' => true,
    'autoSlide' => false,
])
    @slider__item([
        'title' => 'Base Layout',
        'sub_title' => 'This is a slightly longer title called subtitle',
        'text' => 'Here I could put some lorem ipsum text but I am too lazy to Google for one so I wrote all this instead. Woo!',
        'layout' => 'center',
        'containerColor' => 'darkest',
        'textColor' => 'white',
        'mobile_image' => 'https://picsum.photos/720/720',
        'desktop_image' => 'https://picsum.photos/1080/720',
        'heroStyle' => true
    ])
    @endslider__item

    @slider__item([
        'title' => 'Base Layout',
        'sub_title' => 'This is a slightly longer title called subtitle',
        'text' => 'Here I could put some lorem ipsum text but I am too lazy to Google for one so I wrote all this instead. Woo!',
        'layout' => 'bottom',
        'containerColor' => 'darkest',
        'textColor' => 'white',
        'mobile_image' => 'https://picsum.photos/720/720',
        'desktop_image' => 'https://picsum.photos/1080/720',
    ])
    @endslider__item

    @slider__item([
        'title' => 'Base Layout',
        'sub_title' => 'This is a slightly longer title called subtitle',
        'text' => 'Here I could put some lorem ipsum text but I am too lazy to Google for one so I wrote all this instead. Woo!',
        'layout' => 'center',
        'containerColor' => 'transparent',
        'mobile_image' => 'https://picsum.photos/720/720',
        'desktop_image' => 'https://picsum.photos/1080/720',
        'overlay' => 'light',
        'overlay_opacity' => 'medium'
    ])
    @endslider__item

    @slider__item([
        'title' => 'Base Layout',
        'sub_title' => 'This is a slightly longer title called subtitle',
        'text' => 'Here I could put some lorem ipsum text but I am too lazy to Google for one so I wrote all this instead. Woo!',
        'layout' => 'bottom',
        'containerColor' => 'lightest',
        'textColor' => 'theme',
        'mobile_image' => 'https://picsum.photos/720/720',
        'desktop_image' => 'https://picsum.photos/1080/720',
        'background_video' => 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    ])
    @endslider__item

    @slider__item([
        'title' => 'Base Layout',
        'sub_title' => 'This is a slightly longer title called subtitle',
        'text' => 'Here I could put some lorem ipsum text but I am too lazy to Google for one so I wrote all this instead. Woo!',
        'containerColor' => 'primary',
        'layout' => 'center',
    ])
    @endslider__item
@endslider
