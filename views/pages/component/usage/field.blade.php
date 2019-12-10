@field([
    'type' => 'text',
    'attributeList' => [
        'type' => 'email',
        'name' => 'add-email',
        'pattern' => '^[^@]+@[^@]+\.[^@]+$',
        'autocomplete' => 'e-mail',
        'data-invalid-message' => "You need to add a valid E-mail!"
    ],
    'label' => "Add your E-mail",
    'required' => true
])
@endfield


@field([
    'type' => 'checkbox',
    'attributeList' => [
        'name' => 'CheckBoxGroup'
    ],
    'label' => "Im a label"
])
@endfield