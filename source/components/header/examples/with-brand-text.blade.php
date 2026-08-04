@header([
    'classList' => [
        'u-display--flex',
        'u-align-items--center',
        'u-justify-content--space-between',
        'u-gap--4',
    ],
])
    @link(['href' => '#', 'classList' => ['u-display--block']])
        @brand([
            'logotype' => [
                'src' => '/assets/img/brand-red.svg',
                'alt' => 'Brand',
            ],
            'text' => ['Brand Text'],
        ])
        @endbrand
    @endlink

    @button([
        'text' => 'Menu',
        'icon' => 'menu',
        'style' => 'basic',
        'color' => 'default',
        'size' => 'md',
    ])
    @endbutton
@endheader
