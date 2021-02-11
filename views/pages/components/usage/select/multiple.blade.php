@select([
    'label' => 'Select Multiple Name',
    'required' => true,
    'preselected' => 'key2',
    'multiple' => true,
    'options' => [
        'key'   => 'Option One',
        'key1'  => 'Option Two',
        'key2'  => 'Option Three',
        'key3'  => 'Option & Four',
    ]
])
@endselect
