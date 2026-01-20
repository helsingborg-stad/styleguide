@form(['classList' => ['u-padding__y--4']])
    @fileinput([
        'multiple' => true,
        'filesMin' => 2,
        'label' => 'Choose files',
        'preview' => true,
        'description' => 'Display as a file input area (dropzone, multi file).',
    ])
    @endfileinput
    <br>
    @button([
        'type' => 'submit',
        'text' => 'Submit',
    ])
    @endbutton
@endform
