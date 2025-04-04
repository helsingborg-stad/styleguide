
@form()
    @fileinput([
        'display' => 'area',
        'multiple' => false,
        'label' => 'Choose files',
        'description' => 'Display as a file input area (dropzone, single file).',
    ])
    @endfileinput
@endform

@form()
    @fileinput([
        'display' => 'button',
        'multiple' => true,
        'label' => 'Choose files',
        'description' => 'Display as a button (multi file).',
    ])
    @endfileinput
@endform

@form()
    @fileinput([
        'display' => 'button',
        'multiple' => false,
        'label' => 'Choose file',
        'description' => 'Display as a button (single file).',
    ])
    @endfileinput
@endform