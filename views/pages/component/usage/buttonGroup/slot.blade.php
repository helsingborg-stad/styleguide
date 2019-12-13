@buttonGroup(['borderColor' => 'primary', 'toggle' => true])

    @button([
        'color' => 'secondary',
        'text' => 'Toggle #1',
        'size' => 'md',
        'isOutlined' => true,
        'toggle' => true
    ])
    @endbutton

    @button([
        'color' => 'primary',
        'text' => 'Toggle #2',
        'size' => 'md',
        'isOutlined' => true,      
        'background' => 'primary'
    ])
    @endbutton

    @button([
        'isIconButton' =>  true,
        'icon' => ['name' => 'close', 'color' => 'secondary', 'size' => 'lg'],
        'hover' => ['background' => 'secondary']
    ])
    @endbutton

    @button([
        'text' => 'Three',
        'background' => 'primary',
        'color' => 'white'
    ])
    @endbutton

    @button([
        'background' => 'primary',
        'text' => 'Primary bg',
        'color' => 'white'
    ])
    @endbutton

@endbuttonGroup   