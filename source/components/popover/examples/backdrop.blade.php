@button([
    'attributeList' => [
        'popovertarget' => 'backdrop-popover'
    ]
])
    Click me
@endbutton
@popover([
    'id' => 'backdrop-popover',
    'backdrop' => true
])
    @element([
        'attributeList' => [
            'style' => 'width: 300px'
        ]
    ])
        @card([
            'heading' => "I'm a popover",
            'content' => "This is a popover with a backdrop."
        ])
        @endcard
    @endelement
@endpopover