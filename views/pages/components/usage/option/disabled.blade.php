@option([
    'type' => 'checkbox',
    'label' => 'Disabled unchecked',
    'name' => 'disabledCheck',
    'value' => '1',
    'classList' => ['is-disabled'],
    'attributeList' => ['disabled' => 'disabled'],
])
@endoption

@option([
    'type' => 'checkbox',
    'label' => 'Disabled checked',
    'name' => 'disabledChecked',
    'value' => '1',
    'checked' => true,
    'classList' => ['is-disabled'],
    'attributeList' => ['disabled' => 'disabled'],
])
@endoption

@option([
    'type' => 'radio',
    'label' => 'Disabled radio',
    'name' => 'disabledRadio',
    'value' => 'x',
    'classList' => ['is-disabled'],
    'attributeList' => ['disabled' => 'disabled'],
])
@endoption
