@segment([
    'layout'            => 'split',
    'background'        => 'https://picsum.photos/1080/720',
    'textColor'         => 'dark',
    'reverseColumns'    => true,
    'paddingBottom'     => false
])

    @segment([
        'layout'        => 'split',
        'background'    => 'https://picsum.photos/1080/720',
        'textColor'     => 'dark',
        'paddingTop'    => false,
        'textAlignment' => 'bottom'
    ])
    @endsegment
    
@endsegment