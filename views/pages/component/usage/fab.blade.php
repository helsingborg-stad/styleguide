@fab(
    [
        'position' => 'bottom-left',
        'spacing' => 'md',
        'button' =>
        [
            'href' => '#btn-3',
            'background' => 'primary',
            'isIconButton' => true,
            'icon' => ['name' => 'close'],
            'reverseIcon' => true,
            'size' => 'lg',
            'color' => 'secondary',
            'floating' => [
                'animate' => false,
                'hover' => true
            ],
        ]
    ]
)
@endfab

@fab([
    'position' => 'bottom-right',
    'spacing' => 'xl'
])

    @button([
        'background' => 'primary',
        'text' => 'Primary bg',
        'color' => 'white'
    ])
    @endbutton

@endfab