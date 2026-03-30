@scope(['name' => 'a-unique-scope-id', 'classList' => ['u-margin__bottom--2']])
    @button([
        'text' => 'Scope 1 - Button 1',
        'color' => 'primary',
        'style' => 'filled',
        'href' => 'https://getmunicipio.com'

    ])
    @endbutton

    @button([
        'text' => 'Scope 1 - Button 2',
        'color' => 'primary',
        'style' => 'filled',
        'href' => 'https://getmunicipio.com'

    ])
    @endbutton
@endscope

@scope(['name' => 'a-unique-scope-id-2', 'classList' => ['u-margin__bottom--2']])
    @button([
        'text' => 'Scope 2 - Button 1',
        'color' => 'primary',
        'style' => 'filled',
        'href' => 'https://getmunicipio.com'

    ])
    @endbutton

    @button([
        'text' => 'Scope 2 - Button 2',
        'color' => 'primary',
        'style' => 'filled',
        'href' => 'https://getmunicipio.com'

    ])
    @endbutton
@endscope


@button([
    'text' => 'Unscoped - Button 1',
    'color' => 'primary',
    'style' => 'filled',
    'href' => 'https://getmunicipio.com'

])
@endbutton

@button([
    'text' => 'Unscoped - Button 2',
    'color' => 'primary',
    'style' => 'filled',
    'href' => 'https://getmunicipio.com'

])
@endbutton
