@openStreetMap([
    'pins' => [
        [
            'lat' => '56.036647', 
            'lng' => '12.713098',
            'tooltip' => [
                'title' => 'Marker 1',
                ],
            'url' => '#marker1'
        ],
        [
            'lat' => '56.046029', 
            'lng' => '12.693904', 
            'tooltip' => [
                'title' => 'Marker 2',
                'excerpt' => 'This is an excerpt'
                ],
            'url' => '#marker2'
        ]
    ],
    'startPosition' => ['lat' => '56.046029', 'lng' => '12.693904', 'zoom' => 14],
    'height' => '60vh',
    'containerAware' => true,
    'mapStyle' => 'default'
])
@endopenStreetMap

@openStreetMap([
    'pins' => [['lat' => '56.036647', 'lng' => '12.713098'], ['lat' => '56.046029', 'lng' => '12.693904']],
    'startPosition' => ['lat' => '56.046029', 'lng' => '12.693904', 'zoom' => 14],
    'height' => '60vh',
    'containerAware' => true,
    'mapStyle' => 'dark'
])
@endopenStreetMap
