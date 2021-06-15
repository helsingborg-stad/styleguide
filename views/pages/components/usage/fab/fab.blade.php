@fab([
    'position' => 'bottom-right',
    'heading' => "Vestibulum id ligula porta felis euismod semper",
    'button' => [
        'icon' => 'apps',
        'size' => 'md',
        'color' => 'primary',
        'text' => 'Open menu',
        'reversePositions' => true,
    ],
    'classList' => []
])

    @nav([
        'items' => \HbgStyleGuide\Navigation::getMockedMultilevel(),
        'direction' => 'vertical',
        'includeToggle' => false,
        'classList' => ['c-nav--tiles']
    ])
    @endnav

@endfab