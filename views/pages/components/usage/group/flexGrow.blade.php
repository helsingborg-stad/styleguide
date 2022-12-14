@group([
    'classList' => ['u-margin__bottom--3'],
    'flexGrow' => true

])  
    @button([
        'color' => 'primary',
        'size' => 'md',
        'text' => 'flex-grow',
        'background' => 'default'
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
        'text' => 'no flex-grow',
        'background' => 'default'
    ])
    @endbutton
@endgroup