<div style="min-height: 100px">
    @form([
        'method' => 'GET',
        'action' => '?q=select-max-selections'
    ])
        @select([
            'label' => 'Choose up to two interests',
            'multiple' => true,
            'maxSelections' => 2,
            'placeholder' => 'Select interests',
            'options' => [
                'opt1' => 'Technology',
                'opt2' => 'Sports',
                'opt3' => 'Culture',
                'opt4' => 'Science',
                'opt5' => 'Travel',
            ]
        ])
        @endselect
    @endform
</div>
