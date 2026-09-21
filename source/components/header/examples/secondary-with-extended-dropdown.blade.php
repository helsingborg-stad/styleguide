<div style="min-block-size: 24rem">
    @header([
        'backgroundColor' => 'secondary',
        'classList' => [
            'o-container',
        ],
    ])
        @nav([
            'items' => \MunicipioStyleGuide\Navigation::getMockedMultilevel(),
            'direction' => 'horizontal',
            'includeToggle' => true,
            'isExtendedDropdown' => true,
            'height' => 'md',
            'classList' => ['c-nav--popover-primary'],
        ])
        @endnav
    @endheader
</div>