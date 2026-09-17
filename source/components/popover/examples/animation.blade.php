@button([
    'attributeList' => [
        'popovertarget' => 'popover-animation-fade'
    ]
])
    Fade
@endbutton
@popover([
    'id' => 'popover-animation-fade',
    'horizontalPlacement' => 'center',
    'verticalPlacement' => 'bottom',
    'relative' => true,
    'animation' => 'fade'
])
    @element([
        'attributeList' => [
            'style' => 'width: 300px'
        ]
    ])
        @card([
            'heading' => "Fade animation",
            'content' => "This popover uses the fade animation variant. It fades in and out with a subtle scale transition."
        ])
        @endcard
    @endelement
@endpopover

@button([
    'attributeList' => [
        'popovertarget' => 'popover-animation-slide-up'
    ]
])
    Slide Up
@endbutton
@popover([
    'id' => 'popover-animation-slide-up',
    'horizontalPlacement' => 'center',
    'verticalPlacement' => 'bottom',
    'animation' => 'slide-up',
    'relative' => true,
])
    @element([
        'attributeList' => [
            'style' => 'width: 300px'
        ]
    ])
        @card([
            'heading' => "Slide up",
            'content' => "This popover slides upward from below the trigger."
        ])
        @endcard
    @endelement
@endpopover

@button([
    'attributeList' => [
        'popovertarget' => 'popover-animation-slide-down',
    ]
])
    Slide Down
@endbutton
@popover([
    'id' => 'popover-animation-slide-down',
    'horizontalPlacement' => 'center',
    'verticalPlacement' => 'bottom',
    'relative' => true,
    'animation' => 'slide-down'
])
    @element([
        'attributeList' => [
            'style' => 'width: 300px'
        ]
    ])
        @card([
            'heading' => "Slide down",
            'content' => "This popover slides downward from above the trigger."
        ])
        @endcard
    @endelement
@endpopover

@button([
    'attributeList' => [
        'popovertarget' => 'popover-animation-slide-left',
    ]
])
    Slide Left
@endbutton
@popover([
    'id' => 'popover-animation-slide-left',
    'horizontalPlacement' => 'center',
    'verticalPlacement' => 'bottom',
    'relative' => true,
    'animation' => 'slide-left'
])
    @element([
        'attributeList' => [
            'style' => 'width: 300px'
        ]
    ])
        @card([
            'heading' => "Slide left",
            'content' => "This popover slides in from the left."
        ])
        @endcard
    @endelement
@endpopover

@button([
    'attributeList' => [
        'popovertarget' => 'popover-animation-slide-right',
    ]
])
    Slide Right
@endbutton
@popover([
    'id' => 'popover-animation-slide-right',
    'horizontalPlacement' => 'center',
    'verticalPlacement' => 'bottom',
    'relative' => true,
    'animation' => 'slide-right'
])
    @element([
        'attributeList' => [
            'style' => 'width: 300px'
        ]
    ])
        @card([
            'heading' => "Slide right",
            'content' => "This popover slides in from the right."
        ])
        @endcard
    @endelement
@endpopover
