@header([
    'classList' => [
        'u-display--flex',
        'u-align-items--center',
        'u-justify-content--space-between',
        'u-gap--4',
    ],
    'attributeList' => [
        'style' => '--c-brand-height: var(--c-header--logotype-height);',
    ],
])
    @link(['href' => '#', 'classList' => ['u-display--block']])
        @brand([
            'logotype' => [
                'src' => '/assets/img/brand-red.svg',
                'alt' => 'Brand',
            ],
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
