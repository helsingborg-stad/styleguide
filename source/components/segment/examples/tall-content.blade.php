<div style="overflow: hidden;">
    @segment([
        'title'         => 'Split Section With Tall Content',
        'content'       => 'Curabitur blandit tempus porttitor. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. Donec sed odio dui. Nullam id dolor id nibh ultricies vehicula ut id elit. Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Praesent commodo cursus magna, vel scelerisque nisl consectetur et.',
        'layout'        => 'split',
        'image'         => 'https://picsum.photos/id/1040/1080/720',
        'stretch'       => true,
        'textColor'     => 'dark',
        'textAlignment' => 'top'
    ])
        @card([
            'heading' => 'Additional content makes the text column taller',
            'content' => 'This card is included to demonstrate that the split image now stretches to match the content height when the content column grows larger than the image.',
        ])
        @endcard
    @endsegment
</div>