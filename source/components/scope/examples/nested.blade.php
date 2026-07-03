@scope(['name' => 'nested-components-scope'])
    @card([
        'title' => 'Scope 1 - Card 1',
        'text' => 'This is a card within scope 1.',
        'color' => 'primary',
        'style' => 'filled'
    ])
        @button([
            'text' => 'Scope 1 - Button 1',
            'style' => 'basic',
            'href' => 'https://getmunicipio.com'

        ])
        @endbutton
    @endcard
@endscope