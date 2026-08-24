{{-- Collapsible search placed inside a header bar --}}
@header([
    'classList' => [
        'u-display--flex',
        'u-align-items--center',
        'u-justify-content--space-between',
        'u-gap--4',
    ],
])
    @link(['href' => '#', 'classList' => ['u-display--flex']])
        @logotype([
            'src'      => '/assets/img/logotype.svg',
            'alt'      => 'Logotype',
            'maskable' => true,
            'classList' => ['c-header__logotype'],
        ])
        @endlogotype
    @endlink

    @nav([
        'items'     => \MunicipioStyleGuide\Navigation::getMockedTopLevel(),
        'direction' => 'horizontal',
    ])
    @endnav

    @collapsibleSearch([
        'button' => [
            'text'      => 'Sök',
            'icon'      => ['name' => 'search'],
            'style'     => 'basic',
            'color'     => 'default',
            'size'      => 'md',
            'ariaLabel' => 'Öppna sökfält',
            'reversePositions' => true,
        ],
        'placeholder' => 'Vad letar du efter?',
        'action'      => '/search',
    ])
    @endcollapsibleSearch
@endheader
