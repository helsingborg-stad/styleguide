@header([
    'classList' => [
        'u-display--flex',
        'u-align-items--center',
        'u-justify-content--space-between',
        'u-gap--4',
    ],
    'attributeList' => [
        'style' => '--c-header--padding-x-enabled: 0; --c-header--padding-y-enabled: 0;',
    ],
])
    @link(['href' => '#', 'classList' => ['u-display--flex']])
        @logotype([
            'src' => '/assets/img/logotype.svg',
            'alt' => 'Logotype',
            'maskable' => true,
            'classList' => ['c-header__logotype'],
        ])
        @endlogotype
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
