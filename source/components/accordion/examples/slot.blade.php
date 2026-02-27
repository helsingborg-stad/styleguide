@paper(['padding' => 0])
@accordion([])
    @accordion__item([
        'heading' => 'First item'
    ])
        First item content
    @endaccordion__item

    @accordion__item([
        'heading' => 'Second Item'
    ])
        Second item content
    @endaccordion__item
@endaccordion
@endpaper