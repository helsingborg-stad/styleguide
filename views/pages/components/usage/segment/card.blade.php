<div class="o-grid">
    <div class="o-grid-12">
        @segment([
            'title'             => 'Fusce Amet Parturient Etiam',
            'content'           => 'Curabitur blandit tempus porttitor. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum.',
            'layout'            => 'card',
            'image'             => 'https://picsum.photos/id/342/2896/1944',
            'containerAware'    => true,
            'link'              => 'https://helsingborg.se'
        ])
        @endsegment
    </div>
    <div class="u-padding__y--4"></div>
    <div class="o-grid-12">
        @segment([
            'title'             => 'Fusce Amet Parturient Etiam (no image)',
            'content'           => 'Curabitur blandit tempus porttitor. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum.',
            'layout'            => 'card',
            'containerAware'    => true,
            'link'              => 'https://helsingborg.se',
            'hasPlaceholder'    => false
        ])
        @endsegment
    </div>
    <div class="u-padding__y--4"></div>
    <div class="o-grid-4@md">
        @segment([
            'title'             => 'Fusce Amet Parturient Etiam',
            'content'           => 'Curabitur blandit tempus porttitor. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum.',
            'layout'            => 'card',
            'image'             => 'https://picsum.photos/id/342/2896/1944',
            'textColor'         => 'dark',
            'textAlignment'     => 'center'
        ])
        @endsegment
    </div>
    <div class="o-grid-4@md">
        @segment([
            'title'             => 'Fusce Amet Parturient Etiam (no image, placeholder enabled)',
            'content'           => 'Curabitur blandit tempus porttitor. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum.',
            'layout'            => 'card',
            'textColor'         => 'dark',
            'textAlignment'     => 'center',
        ])
        @endsegment
    </div>
    <div class="o-grid-4@md">
        @segment([
            'title'             => 'Linked, No image, Placeholder disabled',
            'content'           => 'Curabitur blandit tempus porttitor. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum.',
            'layout'            => 'card',
            'textColor'         => 'dark',
            'textAlignment'     => 'center',
            'link'              => 'https://helsingborg.se',
            'hasPlaceholder'    => false
        ])
        @endsegment
    </div>

    <div class="o-grid-4@md">
        @segment([
            'title'             => 'Linked, No image, Placeholder enabled',
            'content'           => 'Curabitur blandit tempus porttitor. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum.',
            'layout'            => 'card',
            'textColor'         => 'dark',
            'textAlignment'     => 'center',
            'link'              => 'https://helsingborg.se',
            'hasPlaceholder'    => true
        ])
        @endsegment
    </div>

    <div class="o-grid-4@md">
        @segment([
            'title'             => 'Linked, No image, Placeholder enabled, Single button',
            'content'           => 'Curabitur blandit tempus porttitor. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum.',
            'layout'            => 'card',
            'textColor'         => 'dark',
            'textAlignment'     => 'center',
            'link'              => 'https://helsingborg.se',
            'hasPlaceholder'    => true,
            'buttons'           => [
                [
                    'text'  => 'Read more',
                    'href'   => 'https://helsingborg.se'
                ]
            ]
        ])
        @endsegment
    </div>

    <div class="o-grid-4@md">
        @segment([
            'title'             => 'Linked, No image, Placeholder enabled, Single button',
            'content'           => 'Curabitur blandit tempus porttitor. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum.',
            'layout'            => 'card',
            'textColor'         => 'dark',
            'textAlignment'     => 'center',
            'link'              => 'https://helsingborg.se',
            'hasPlaceholder'    => true,
            'buttons'           => [
                [
                    'color' => 'primary',
                    'style' => 'filled',
                    'text'  => 'Helsingborg.se',
                    'href'   => 'https://helsingborg.se'
                ],
                [
                    'color' => 'secondary',
                    'style' => 'filled',
                    'text'  => 'Get Municipio',
                    'href'   => 'https://getmunicipio.com'
                ]
            ]
        ])
        @endsegment
    </div>
</div>