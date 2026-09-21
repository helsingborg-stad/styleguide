@header([
    'backgroundColor' => 'primary',
    'classList' => [
        'o-container',
    ],
])
    @nav([
        'items' => \MunicipioStyleGuide\Navigation::getMockedMultilevel(),
        'direction' => 'horizontal',
        'includeToggle' => true,
        'height' => 'md',
    ])
    @endnav
@endheader
