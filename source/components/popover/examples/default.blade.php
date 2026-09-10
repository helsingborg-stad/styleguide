@button([
    'attributeList' => [
        'popovertarget' => 'default-popover'
    ]
])
    Click me
@endbutton
@popover([
    'id' => 'default-popover'
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