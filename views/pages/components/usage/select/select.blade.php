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
        'label' => "Enter text",
        'errorMessagel' => 'You need to select an item'
    ])
    @endfield

    @select([
        'label' => 'Select Name',
        'required' => true,
        'options' => [
            'key'   => 'Option One',
            'key1'  => 'Option Two',
            'key2'  => 'Option Three',
            'key3'  => 'Option Four',
        ]
    ])
    @endselect


    @button([
        'text' => 'Submit',
        'color' => 'primary',
        'type' => 'basic'
    ])
    @endbutton

@endform