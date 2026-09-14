@button([
    'attributeList' => [
        'popovertarget' => 'placement-popover-top'
    ]
])
    top
@endbutton
@popover([
    'id' => 'placement-popover-top',
    'verticalPlacement' => 'top'
])
    @element([
        'attributeList' => [
            'style' => 'width: 300px'
        ]
    ])
        @card([
            'heading' => "I'm a popover",
            'content' => "This popover is placed at the top relative to the viewport."
        ])
        @endcard
    @endelement
@endpopover

@button([
    'attributeList' => [
        'popovertarget' => 'placement-popover-center'
    ]
])
    Center
@endbutton
@popover([
    'id' => 'placement-popover-center',
    'verticalPlacement' => 'center'
])
    @element([
        'attributeList' => [
            'style' => 'width: 300px'
        ]
    ])
        @card([
            'heading' => "I'm a popover",
            'content' => "This popover is placed at the center relative to the viewport."
        ])
        @endcard
    @endelement
@endpopover

@button([
    'attributeList' => [
        'popovertarget' => 'placement-popover-bottom'
    ]
])
    bottom
@endbutton
@popover([
    'id' => 'placement-popover-bottom',
    'verticalPlacement' => 'bottom'
])
    @element([
        'attributeList' => [
            'style' => 'width: 300px'
        ]
    ])
        @card([
            'heading' => "I'm a popover",
            'content' => "This popover is placed at the bottom relative to the viewport."
        ])
        @endcard
    @endelement
@endpopover