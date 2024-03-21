@group([
    'classList' => ['u-margin__bottom--3'],
    'flexShrink' => true,
])  
    @button([
        'color' => 'primary',
        'size' => 'md',
        'text' => 'flex shrink'
    ])
    @endbutton
@endgroup

@group([
    'classList' => ['u-margin__bottom--3'],
    'flexShrink' => false,

])  
    @button([
        'color' => 'primary',
        'size' => 'md',
        'text' => 'no flex-shrink',
        'attributeList' => [
            'style' => 'width:300px;max-width:unset;'
        ]
    ])
    @endbutton
@endgroup