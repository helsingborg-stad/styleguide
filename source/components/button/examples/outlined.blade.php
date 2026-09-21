@button([
    'text' => 'Primary outlined',
    'style' => 'outlined',
    'color' => 'primary',
    'href' => 'https://getmunicipio.com'
])
@endbutton

@button([
    'text' => 'Secondary outlined',
    'color' => 'secondary',
    'style' => 'outlined'
])
@endbutton

@button([
    'text' => 'Default outlined',
    'color' => 'default',
    'style' => 'outlined'
])
@endbutton

<span style="color: var(--color--secondary);">
    @button([
        'text' => 'Inherited outlined',
        'color' => 'inherit',
        'style' => 'outlined'
    ])
    @endbutton
</span>
