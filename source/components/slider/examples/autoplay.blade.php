@slider([
    'autoSlide' => 5,
])
    @slider__item([
        'title' => 'First story',
        'text' => 'This slider advances every five seconds until you pause it.',
        'layout' => 'center',
        'containerColor' => 'darkest',
        'image' => 'https://picsum.photos/id/19/1080/720',
        'heroStyle' => true,
    ])
    @endslider__item

    @slider__item([
        'title' => 'Second story',
        'text' => 'The accessible control can pause and resume autoplay with a mouse, touch or keyboard.',
        'layout' => 'bottom',
        'containerColor' => 'darkest',
        'image' => 'https://picsum.photos/id/47/1080/720',
    ])
    @endslider__item

    @slider__item([
        'title' => 'Third story',
        'text' => 'Autoplay pauses while this slider or one of its controls has focus.',
        'layout' => 'center',
        'containerColor' => 'darkest',
        'image' => 'https://picsum.photos/id/102/1080/720',
    ])
    @endslider__item
@endslider
