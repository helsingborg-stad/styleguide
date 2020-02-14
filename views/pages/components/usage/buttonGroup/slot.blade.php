@buttonGroup(['borderColor' => 'primary', 'toggle' => true])

    @button([
        'color' => 'secondary',
        'text' => 'Toggle',
        'size' => 'md',
        'type' => 'filled',
        'toggle' => true
    ])
    @endbutton

    @button([
        'color' => 'primary',
        'text' => 'Outlined',
        'size' => 'md',
        'type' => 'outlined'
    ])
    @endbutton

    @button([
        'type' =>  'outlined',
        'icon' => 'close'
    ])
    @endbutton

    @button([
        'text' => 'Primary filled',
        'color' => 'primary'
    ])
    @endbutton

@endbuttonGroup   