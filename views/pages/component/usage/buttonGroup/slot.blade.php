@buttonGroup(['borderColor' => 'primary', 'toggle' => true])

    @button([
        'color' => 'secondary',
        'text' => 'Toggle',
        'size' => 'md',
        'isOutlined' => true,
        'toggle' => true
    ])
    @endbutton

    @button([
        'color' => 'primary',
        'text' => 'Outlined',
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
        'background' => 'primary',
        'text' => 'Primary bg',
        'color' => 'white'
    ])
    @endbutton

@endbuttonGroup   