@button([
    'attributeList' => [
        'popovertarget' => 'placement-relative-popover-left'
    ]
])
    Left
@endbutton
@popover([
    'id' => 'placement-relative-popover-left',
    'relativeToTrigger' => true,
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
        'popovertarget' => 'placement-relative-popover-center'
    ]
])
    Center
@endbutton
@popover([
    'id' => 'placement-relative-popover-center',
    'relativeToTrigger' => true,
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
        'popovertarget' => 'placement-relative-popover-right'
    ]
])
    Right
@endbutton
@popover([
    'id' => 'placement-relative-popover-right',
    'relativeToTrigger' => true,
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
