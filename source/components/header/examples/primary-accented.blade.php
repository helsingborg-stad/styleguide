@header([
    'backgroundColor' => 'primary',
    'classList' => [
        'o-container', 
        'o-container',
        'c-header--accented'
    ]
])
    @nav([
        'items' => \MunicipioStyleGuide\Navigation::getMockedTopLevel(),
        'direction' => 'horizontal',
    ])
    @endnav
@endheader