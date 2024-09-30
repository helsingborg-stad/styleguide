@slider([
    'showStepper' => true,
    'autoSlide' => false,
    'arrowButtons' => array("color" => "secondary", "style" => "outlined")
])
    @slider__item([
        'image' => 'https://picsum.photos/1080/720',
        'title' => 'Base Layout',
        'text' => 'Here I could put some lorem ipsum text but I am too lazy to Google for one so I wrote all this instead. Woo!',
        'layout' => 'center',
        'containerColor' => 'darkest'
    ])
    @endslider__item

    @slider__item([
        'title' => 'Base Layout',
        'image' => 'https://picsum.photos/1080/720',
        'text' => 'Here I could put some lorem ipsum text but I am too lazy to Google for one so I wrote all this instead. Woo!',
        'layout' => 'bottom',
        'containerColor' => 'darkest'
    ])
    @endslider__item
@endslider
