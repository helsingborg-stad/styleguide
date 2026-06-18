<div style="min-height: 300px">
    @form([
        'method' => 'GET',
        'action' => '?q=select-preselected'
    ])
        @select([
            'label' => 'Choose a size',
            'preselected' => 'md',
            'options' => [
                'sm' => 'Small',
                'md' => 'Medium',
                'lg' => 'Large',
            ]
        ])
        @endselect
    @endform
</div>
