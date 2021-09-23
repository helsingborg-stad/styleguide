@segment([
    'title'             => 'The quick brown fox jumps over the lazy dog',
    'content'           => 'Maecenas sed diam eget risus varius blandit sit amet non magna. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit.',
    'layout'        => 'split',
    'image'         => 'https://picsum.photos/1080/720?e',
    'background'    => 'primary',
    'textColor'     => 'light',
    'textAlignment' => 'center',
    'imageFocus'    => ['top' => '90', 'left' => '100']
])
    @card([
        'heading' => 'Hey! Have you seen this?',
        'content' => 'You can add a card inside this split section, or any other component. Awesome!',
    ])
    @endcard
@endsegment