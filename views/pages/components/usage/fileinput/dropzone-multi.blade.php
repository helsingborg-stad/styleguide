@form()
    @fileinput([
        'display' => 'area',
        'multiple' => true,
        'label' => 'Choose files',
        'description' => 'Display as a file input area (dropzone, multi file).',
    ])
    @endfileinput
@endform
