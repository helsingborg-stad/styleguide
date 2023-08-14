
@openStreetMap([
    'startPosition' => ['lat' => '56.046029', 'lng' => '12.693904', 'zoom' => 14],
    'height' => '100vh',
    'containerAware' => true,
    'mapStyle' => 'pale'
])
    @slot('sidebarContent')
        @typography([
            'element' => 'h2',
            'classList' => ['u-margin__top--0', 'u-margin__bottom--4']
        ])
            Info
        @endtypography
        @card([
            'attributeList' => [
                'data-js-map-location' => json_encode(
                    array('lat' => '56.032075356631', 'lng' => '12.70340666113')
                ),
            ],
            'classList' => [
                'u-padding--2',
                'u-margin__bottom--2'
            ]
        ]) 
        @typography([
            'element' => 'h3'
        ])
        #Read me
        @endtypography
        @typography([
        ])
        This element contains an attribute that automatically creates a pin and adds it to the map.
        @endtypography
        @endcard

           @card([
            'attributeList' => [
                'data-js-map-location' => json_encode(
                    array(
                        'lat' => '56.052075356631', 
                        'lng' => '12.70340666113',
                        'tooltip' => [
                            'title' => 'Tooltip title',
                            'excerpt' => 'Tooltip excerpt',
                            'directions' => [
                                'label' => 'Directions label',
                                'url' => 'https://www.google.com/maps/dir/?api=1&destination=56.052075356631,12.70340666113&travelmode=transit',
                            ]
                        ],
                    )
                ),
            ],
            'classList' => [
                'u-padding--2',
            ]
        ]) 
        @typography([
            'element' => 'h3'
        ])
        #Click me
        @endtypography
        @typography([
        ])
        A tooltip can also be added which has the same structure as a "pin" in the "pins" array. This tooltip will open when clicking on the connected element in the sidebar.
        @endtypography
        @endcard
    @endslot
@endopenStreetMap