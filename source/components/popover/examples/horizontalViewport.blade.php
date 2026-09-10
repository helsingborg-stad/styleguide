@button([
    'attributeList' => [
        'popovertarget' => 'placement-popover-left'
    ]
])
    Left
@endbutton
@popover([
    'id' => 'placement-popover-left',
    'horizontalPlacement' => 'left'
])
    @element([
        'attributeList' => [
            'style' => 'width: 300px'
        ]
    ])
        @card([
            'heading' => "I'm a popover",
            'content' => "This popover is placed at the left relative to its trigger element."
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
    'horizontalPlacement' => 'center'
])
    @element([
        'attributeList' => [
            'style' => 'width: 300px'
        ]
    ])
        @card([
            'heading' => "I'm a popover",
            'content' => "This popover is placed at the center relative to its trigger element."
        ])
        @endcard
    @endelement
@endpopover

@button([
    'attributeList' => [
        'popovertarget' => 'placement-popover-right'
    ]
])
    Right
@endbutton
@popover([
    'id' => 'placement-popover-right',
    'horizontalPlacement' => 'right'
])
    @element([
        'attributeList' => [
            'style' => 'width: 300px'
        ]
    ])
        @card([
            'heading' => "I'm a popover",
            'content' => "This popover is placed at the right relative to its trigger element."
        ])
        @endcard
    @endelement
@endpopover