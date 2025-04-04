
@form()
    @fileinput([
        'display' => 'button',
        'multiple' => false,
        'label' => 'Choose file',
        'description' => 'Display as a button (single file).',
    ])
    @endfileinput
@endform