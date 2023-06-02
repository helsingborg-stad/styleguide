
@openStreetMap([
    'pins' => [
        [
            'lat' => '56.036647', 
            'lng' => '12.713098',
            'tooltip' => [
                'title' => 'Marker 1 clickable',
                'excerpt' => 'This is an excerpt.',
                'image' => [
                    'src' => 'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80',
                    'alt' => 'The alt text'
                ],
                'directions' => [
                    'label' => 'The directions label',
                    'url' => '#directionsUrl'
                ]
            ],
        ], 
        [
            'lat' => '56.046029', 
            'lng' => '12.693904',
            'tooltip' => [
                'title' => 'Marker 2 clickable',
                'excerpt' => 'This is an excerpt.',
                'image' => [
                    'src' => 'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80',
                    'alt' => 'The alt text'
                ],
                'directions' => [
                    'label' => 'The directions label',
                    'url' => '#directionsUrl'
                ]
            ],
        ]
    ],
    'startPosition' => ['lat' => '56.046029', 'lng' => '12.693904', 'zoom' => 14],
    'height' => '60vh',
    'containerAware' => true,
    'mapStyle' => 'dark'
])
@endopenStreetMap
