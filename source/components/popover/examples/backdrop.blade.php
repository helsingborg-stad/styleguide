@button([
    'attributeList' => [
        'popovertarget' => 'popover-viewport-backdrop',
    ]
])
    Backdrop
@endbutton
@popover([
    'id' => 'popover-viewport-backdrop',
    'backdrop' => true
])
    @element([
        'attributeList' => [
            'style' => 'width: 300px'
        ]
    ])
        @card([
            'heading' => "I'm a popover",
            'content' => "This is a card, inside a popover. I need to make sure there is a set width for my container or it wont work because of how container queries operate."
        ])
        @endcard
    @endelement
@endpopover
