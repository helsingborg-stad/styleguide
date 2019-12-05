@field([
    'type' => 'text',
    'attributeList' => [
        'type' => 'date',
        'name' => 'date',
        'value' => date('Y-m-d'),
    ],
    'label' => "Set your date"
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