
<div style="min-height: 300px">
    @form([
        'method' => 'GET',
        'action' => '?q=select-single'
    ])
        @select([
            'label' => 'Select Multiple Name',
            'required' => true,
            'placeholder' => "Placeholder in multi ",
            'preselected' => ['key2', 'key'],
            'multiple' => true,
            'options' => [
                'key'   => 'Option One',
                'key1'  => 'Option Two',
                'key2'  => 'Option Three',
                'key3'  => 'Option & Four',
            ],
        ])
        @endselect
    @endform
</div>
