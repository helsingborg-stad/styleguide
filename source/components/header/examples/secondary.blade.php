@header([
    'backgroundColor' => 'secondary',
    'classList' => [
        'o-container', 
        'o-container',
    ]
])
    @nav([
        'items' => \MunicipioStyleGuide\Navigation::getMockedTopLevel(),
        'direction' => 'horizontal',
    ])
    @endnav
@endheader