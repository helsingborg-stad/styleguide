@header([
    'backgroundColor' => 'secondary',
    'classList' => [
        'o-container', 
        'o-container',
    ]
])
    @nav([
        'items' => \HbgStyleGuide\Navigation::getMockedTopLevel(),
        'direction' => 'horizontal',
    ])
    @endnav
@endheader