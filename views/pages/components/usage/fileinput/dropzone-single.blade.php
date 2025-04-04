@form()
    @fileinput([
        'display' => 'area',
        'multiple' => false,
        'label' => 'Choose files',
        'description' => 'Display as a file input area (dropzone, single file).',
    ])
    @endfileinput
@endform