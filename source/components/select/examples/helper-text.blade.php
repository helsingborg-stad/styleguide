<div style="min-height: 100px">
    @form([
        'method' => 'GET',
        'action' => '?q=select-helper-text'
    ])
        @select([
            'label' => 'Preferred language',
            'helperText' => 'Your selection will affect the language of all notifications.',
            'placeholder' => 'Select a language',
            'options' => [
                'en' => 'English',
                'sv' => 'Swedish',
                'no' => 'Norwegian',
                'da' => 'Danish',
            ]
        ])
        @endselect
    @endform
</div>
