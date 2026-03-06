@header([
    'classList' => [
        'o-container', 
        'o-container',
        'c-header--accented'
    ]
])
    @nav([
        'items' => \HbgStyleGuide\Navigation::getMockedTopLevel(),
        'direction' => 'horizontal',
    ])
    @endnav
@endheader