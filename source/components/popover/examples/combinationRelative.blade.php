@button([
    'attributeList' => [
        'popovertarget' => 'placement-relative-popover-top-left',
        'style' => 'anchor-name:--placement-relative-popover-top-left'
    ]
])
    Top Left
@endbutton
@popover([
    'id' => 'placement-relative-popover-top-left',
    'attributeList' => [
        'style' => 'position-anchor:--placement-relative-popover-top-left;left:anchor(right);top:anchor(top);'
    ],
    'relative' => true,
    'horizontalPlacement' => 'left',
    'verticalPlacement' => 'top'
])
    @element([
        'attributeList' => [
            'style' => 'width: 300px'
        ]
    ])
        @card([
            'heading' => "I'm a popover",
            'content' => "This popover is placed at top-left relative to its trigger element."
        ])
        @endcard
    @endelement
@endpopover

@button([
    'attributeList' => [
        'popovertarget' => 'placement-relative-popover-top-center'
    ]
])
    Top Center
@endbutton
@popover([
    'id' => 'placement-relative-popover-top-center',
    'relative' => true,
    'horizontalPlacement' => 'center',
    'verticalPlacement' => 'top'
])
    @element([
        'attributeList' => [
            'style' => 'width: 300px'
        ]
    ])
        @card([
            'heading' => "I'm a popover",
            'content' => "This popover is placed at top-center relative to its trigger element."
        ])
        @endcard
    @endelement
@endpopover

@button([
    'attributeList' => [
        'popovertarget' => 'placement-relative-popover-top-right'
    ]
])
    Top Right
@endbutton
@popover([
    'id' => 'placement-relative-popover-top-right',
    'relative' => true,
    'horizontalPlacement' => 'right',
    'verticalPlacement' => 'top'
])
    @element([
        'attributeList' => [
            'style' => 'width: 300px'
        ]
    ])
        @card([
            'heading' => "I'm a popover",
            'content' => "This popover is placed at top-right relative to its trigger element."
        ])
        @endcard
    @endelement
@endpopover

@button([
    'attributeList' => [
        'popovertarget' => 'placement-relative-popover-center-left'
    ]
])
    Center Left
@endbutton
@popover([
    'id' => 'placement-relative-popover-center-left',
    'relative' => true,
    'horizontalPlacement' => 'left',
    'verticalPlacement' => 'center'
])
    @element([
        'attributeList' => [
            'style' => 'width: 300px'
        ]
    ])
        @card([
            'heading' => "I'm a popover",
            'content' => "This popover is placed at center-left relative to its trigger element."
        ])
        @endcard
    @endelement
@endpopover

@button([
    'attributeList' => [
        'popovertarget' => 'placement-relative-popover-center-center'
    ]
])
    Center Center
@endbutton
@popover([
    'id' => 'placement-relative-popover-center-center',
    'relative' => true,
    'horizontalPlacement' => 'center',
    'verticalPlacement' => 'center'
])
    @element([
        'attributeList' => [
            'style' => 'width: 300px'
        ]
    ])
        @card([
            'heading' => "I'm a popover",
            'content' => "This popover is placed at center-center relative to its trigger element."
        ])
        @endcard
    @endelement
@endpopover

@button([
    'attributeList' => [
        'popovertarget' => 'placement-relative-popover-center-right'
    ]
])
    Center Right
@endbutton
@popover([
    'id' => 'placement-relative-popover-center-right',
    'relative' => true,
    'horizontalPlacement' => 'right',
    'verticalPlacement' => 'center'
])
    @element([
        'attributeList' => [
            'style' => 'width: 300px'
        ]
    ])
        @card([
            'heading' => "I'm a popover",
            'content' => "This popover is placed at center-right relative to its trigger element."
        ])
        @endcard
    @endelement
@endpopover

@button([
    'attributeList' => [
        'popovertarget' => 'placement-relative-popover-bottom-left'
    ]
])
    Bottom Left
@endbutton
@popover([
    'id' => 'placement-relative-popover-bottom-left',
    'relative' => true,
    'horizontalPlacement' => 'left',
    'verticalPlacement' => 'bottom'
])
    @element([
        'attributeList' => [
            'style' => 'width: 300px'
        ]
    ])
        @card([
            'heading' => "I'm a popover",
            'content' => "This popover is placed at bottom-left relative to its trigger element."
        ])
        @endcard
    @endelement
@endpopover

@button([
    'attributeList' => [
        'popovertarget' => 'placement-relative-popover-bottom-center'
    ]
])
    Bottom Center
@endbutton
@popover([
    'id' => 'placement-relative-popover-bottom-center',
    'relative' => true,
    'horizontalPlacement' => 'center',
    'verticalPlacement' => 'bottom'
])
    @element([
        'attributeList' => [
            'style' => 'width: 300px'
        ]
    ])
        @card([
            'heading' => "I'm a popover",
            'content' => "This popover is placed at bottom-center relative to its trigger element."
        ])
        @endcard
    @endelement
@endpopover

@button([
    'attributeList' => [
        'popovertarget' => 'placement-relative-popover-bottom-right'
    ]
])
    Bottom Right
@endbutton
@popover([
    'id' => 'placement-relative-popover-bottom-right',
    'relative' => true,
    'horizontalPlacement' => 'right',
    'verticalPlacement' => 'bottom'
])
    @element([
        'attributeList' => [
            'style' => 'width: 300px'
        ]
    ])
        @card([
            'heading' => "I'm a popover",
            'content' => "This popover is placed at bottom-right relative to its trigger element."
        ])
        @endcard
    @endelement
@endpopover
