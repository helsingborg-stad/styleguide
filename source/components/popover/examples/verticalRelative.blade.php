@button([
    'attributeList' => [
        'popovertarget' => 'placement-relative-popover-top'
    ]
])
    Top
@endbutton
@popover([
    'id' => 'placement-relative-popover-top',
    'relativeToTrigger' => true,
    'verticalPlacement' => 'top'
])
    @element([
        'attributeList' => [
            'style' => 'width: 300px'
        ]
    ])
        @card([
            'heading' => "I'm a popover",
            'content' => "This popover is placed at the top relative to its trigger element."
        ])
        @endcard
    @endelement
@endpopover

@button([
    'attributeList' => [
        'popovertarget' => 'placement-relative-popover-center-y'
    ]
])
    Center
@endbutton
@popover([
    'id' => 'placement-relative-popover-center-y',
    'relativeToTrigger' => true,
    'verticalPlacement' => 'center'
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
        'popovertarget' => 'placement-relative-popover-bottom'
    ]
])
    Bottom
@endbutton
@popover([
    'id' => 'placement-relative-popover-bottom',
    'relativeToTrigger' => true,
    'verticalPlacement' => 'bottom'
])
    @element([
        'attributeList' => [
            'style' => 'width: 300px'
        ]
    ])
        @card([
            'heading' => "I'm a popover",
            'content' => "This popover is placed at the bottom relative to its trigger element."
        ])
        @endcard
    @endelement
@endpopover
