@group([
    'classList' => ['u-margin__bottom--3', 'u-width--100'],
    'flexGrow' => true
])  
    @button([
        'color' => 'primary',
        'size' => 'md',
        'text' => 'flex-grow'
    ])
    @endbutton
@endgroup

@group([
    'classList' => ['u-margin__bottom--3'],
    'flexGrow' => false

])  
    @button([
        'color' => 'primary',
        'size' => 'md',
        'text' => 'no flex-grow'
    ])
    @endbutton
@endgroup
