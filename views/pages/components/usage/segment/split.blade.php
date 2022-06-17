@segment([
    'title'         => 'Fusce Amet Parturient Etiam',
    'content'       => 'Curabitur blandit tempus porttitor. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum.',
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