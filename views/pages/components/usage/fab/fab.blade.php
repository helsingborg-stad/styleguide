@fab([
    'position' => 'bottom-left',
    'spacing' => 'md',
    'button' => [
        'icon' => 'close',
        'size' => 'lg',
        'color' => 'secondary'
    ],
    'classList' => ['d-fab__left','u-position--static']
])
@endfab

@fab([
    'position' => 'bottom-right',
    'spacing' => 'md',
    'classList' => [
        'u-position--static'
    ]
])

    @button([
        'type' => 'filled',
        'icon' => 'close',
        'size' => 'lg',
        'text' => 'Right',
        'color' => 'primary'
        
    ])
    @endbutton

@endfab