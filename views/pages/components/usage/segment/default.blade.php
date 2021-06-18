@segment([
    'background'    => 'https://picsum.photos/1080/720',
    'height'        => 'full-screen',
    'overlay'       => 'dark',
    'textColor'     => 'light'
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

@segment([
    'layout'        => 'split',
    'background'    => 'https://picsum.photos/1080/720',
    'height'        => 'full-screen',
    'textColor'     => 'dark',
    'reverseColumns' => true
])

    @segment([
        'layout'        => 'split',
        'background'    => 'https://picsum.photos/1080/720',
        'height'        => 'full-screen',
        'textColor'     => 'dark',
        'reverseColumns' => true
    ])


    @endsegment

@endsegment