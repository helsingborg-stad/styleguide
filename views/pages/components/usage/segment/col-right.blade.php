@segment([
    'layout' => 'col-right',
    'title' => 'Column Right',
    'sub_title' => 'This is a slightly longer title called subtitle',
    'height' => 'lg',
    'color' => 'black'
])
    @slot('top')
    @endslot

    @slot('main')
        @card([
            'heading' => 'Heading',
            'subHeading' => 'SubHeading',
            'content' => 'Atoms are the fundemental building blocks. They are rarely used just by them self but mostly used to build more advanced components.',
            'image' => [
                'src' => '/assets/img/component.svg',
                'alt' => 'ALT',
                'backgroundColor' => 'secondary',
                'padded' => true
            ]
        ])
        @endcard
    @endslot

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