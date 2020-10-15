@select([
    'label' => 'Select Name',
    'required' => true,
    'preselected' => 'key2',
    'options' => [
        'key'   => 'Option One',
        'key1'  => 'Option Two',
        'key2'  => 'Option Three',
        'key3'  => 'Option Four',
    ]
])
@endselect
