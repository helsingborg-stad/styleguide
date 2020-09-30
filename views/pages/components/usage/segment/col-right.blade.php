@segment([
    'layout' => 'col-right',
    'title' => 'Column Right',
    'sub_title' => 'This is a slightly longer title called subtitle',
    'height' => 'lg',
    'color' => 'black'
])

    @slot('bottom')
        @button([
            'text' => 'Primary filled',
            'color' => 'primary',
            'type' => 'filled'
        
        ])
        @endbutton
        
        @button([
            'text' => 'Secondary filled',
            'color' => 'secondary',
            'type' => 'filled'
        
        ])
        @endbutton
        
        @button([
            'text' => 'Default filled',
            'color' => 'default',
            'type' => 'filled'
        ])
        @endbutton
    @endslot
@endsegment