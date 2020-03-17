@fab([
    'position' => 'bottom-left',
    'spacing' => 'md',
    'button' => [
        'icon' => 'close',
        'size' => 'lg',
        'color' => 'secondary'
    ],
    'classList' => ['d-fab__left']
])
@endfab

@fab([
    'position' => 'bottom-right',
    'spacing' => 'md'
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