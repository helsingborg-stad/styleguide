@segment([
    'title' => 'Base Layout',
    'sub_title' => 'This is a slightly longer title called subtitle',
    'text' => 'Here I could put some lorem ipsum text but I am too lazy to Google for one so I wrote all this instead. Woo!',
    'background_image' => 'https://i.picsum.photos/id/876/1080/720.jpg',
    'overlay' => 'light',
    'overlay_opacity' => 'high'
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