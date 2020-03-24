@form([
    'method' => 'POST',
    'action' => '?q=form_component'
])
    @field([
        'type' => 'text',
        'attributeList' => [
            'type' => 'text',
            'name' => 'text',
        ],
        'label' => "Enter text"
    ])
    @endfield

    @button([
        'text' => 'Submit',
        'color' => 'primary',
        'type' => 'basic'
    ])
    @endbutton

@endform