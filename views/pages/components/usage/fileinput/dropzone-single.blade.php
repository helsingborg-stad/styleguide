@form(['classList' => ['u-padding__y--4']])
    @fileinput([
        'multiple' => false,
        'label' => 'Choose files',
        'description' => 'Display as a file input area (dropzone, single file).',
    ])
    @endfileinput
@endform