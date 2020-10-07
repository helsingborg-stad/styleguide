@segment([
    'layout' => 'col-left',
    'title' => 'Column Left',
    'sub_title' => 'This is a slightly longer title called subtitle',
    'text' => 'Here I could put some lorem ipsum text but I am too lazy to Google for one so I wrote all this instead. Woo!',
    'overlay' => 'blur',
    'color' => 'white',
    'classList' => ['u-color__bg--secondary']
])

    @testimonials(
        ['perRow' => 1,
            'testimonials' => array(
                array(
                    'name' => 'Dalai Lama',
                    'title' => 'Spiritual and political leader of Tibetans',
                    'titleElement' => 'h5',
                    'testimonial' => "Anger and hatred are signs of weakness, while compassion is a sure sign of strength. Bless this component...",
                    'image' => 'https://picsum.photos/200/200?image=1022',
                    'quoteColor' => 'primary'
                )
            )]
        )
    @endtestimonials

    @slot('bottom')
        @button([
            'text' => 'Primary filled',
            'color' => 'primary',
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