@segment([
    'layout'        => 'split',
    'image'         => 'https://picsum.photos/1080/720?e',
    'background'    => 'primary',
    'textColor'     => 'light',
    'textAlignment' => 'center'
])
    @card([
        'heading' => 'Hey! Have you seen this?',
        'content' => 'You can add a card inside this split section, or any other component. Awesome!',
    ])
    @endcard
@endsegment