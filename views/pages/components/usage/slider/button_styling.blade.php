@slider([
    'showStepper' => true,
    'autoSlide' => false,
    'arrowButtons' => array("color" => "secondary", "style" => "outlined")
])
    @slider__item([
        'title' => 'Base Layout',
        'sub_title' => 'This is a slightly longer title called subtitle',
        'text' => 'Here I could put some lorem ipsum text but I am too lazy to Google for one so I wrote all this instead. Woo!',
        'layout' => 'center',
        'containerColor' => 'darkest',
        'textColor' => 'white',

    ])
    @endslider__item

    @slider__item([
        'title' => 'Base Layout',
        'sub_title' => 'This is a slightly longer title called subtitle',
        'text' => 'Here I could put some lorem ipsum text but I am too lazy to Google for one so I wrote all this instead. Woo!',
        'layout' => 'bottom',
        'containerColor' => 'darkest',
        'textColor' => 'white',
    ])
    @endslider__item
@endslider
