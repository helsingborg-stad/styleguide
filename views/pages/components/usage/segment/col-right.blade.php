@segment([
    'layout' => 'col-right',
    'title' => 'Column Right',
    'sub_title' => 'This is a slightly longer title called subtitle',
    'height' => 'lg',
    'background_image' => 'https://i.picsum.photos/id/876/1080/720.jpg',
    'color' => 'white'
])
    @slot('top')
    @endslot

    @slot('main')
        @table([
            'list' => [
                ['Mr. Unknown', 'Cras justo odio, dapibus ac facilisis in, egestas eget quam. Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit.', 'Vestibulum id ligula porta felis euismod semper. Cras mattis consectetur purus sit amet fermentum.', 'https://helsingborg.se/kommun-och-politik/kontakt-och-paverkan/kontakta-kommunen/skicka-meddelande/'],
                ['Mrs. Unknown', 'Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Praesent commodo cursus magna, vel scelerisque nisl consectetur et.', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur blandit tempus porttitor.', 'https://helsingborg.se/kommun-och-politik/kontakt-och-paverkan/kontakta-kommunen/specialistfunktioner-pa-helsingborg-kontaktcenter/']
            ],
            'headings' => ['Name', 'Description', 'Details', 'Link'],
            'showFooter' => true
        ])
        @endtable
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