@form()
    @fileinput([
        'display' => 'button',
        'multiple' => true,
        'label' => 'Choose files',
        'description' => 'Display as a button (multi file).',
    ])
    @endfileinput
@endform