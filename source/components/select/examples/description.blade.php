<div style="min-height: 100px">
    @form([
        'method' => 'GET',
        'action' => '?q=select-description'
    ])
        @select([
            'label' => 'Country of residence',
            'description' => 'Select the country where you currently reside.',
            'placeholder' => 'Select a country',
            'options' => [
                'se' => 'Sweden',
                'no' => 'Norway',
                'dk' => 'Denmark',
                'fi' => 'Finland',
            ]
        ])
        @endselect
    @endform
</div>
