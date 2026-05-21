@form([
    'method' => 'POST',
    'action' => '/submit-form',
    'validation' => true,
    'errorMessage' => 'There were errors with your submission. Please correct them and try again.',
    'successMessage' => 'Your form has been submitted successfully!'
])
    @field([
        'type' => 'text',
        'name' => 'name',
        'label' => 'Name',
        'required' => true,
    ])
    @endfield
    @button([
        'type' => 'submit',
        'text' => 'Submit',
    ])
    @endbutton
@endform