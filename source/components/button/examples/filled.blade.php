@button([
    'text' => 'Primary filled',
    'color' => 'primary',
    'style' => 'filled',
    'href' => 'https://getmunicipio.com'

])
@endbutton

@button([
    'text' => 'Secondary filled',
    'color' => 'secondary',
    'style' => 'filled'

])
@endbutton

@button([
    'text' => 'Default filled',
    'color' => 'default',
    'style' => 'filled'
])
@endbutton

<span style="background-color: var(--color--surface); color: var(--color--secondary); --inherit-color-background: var(--color--surface); --inherit-color-contrast: var(--color--secondary);">
    @button([
        'text' => 'Inherited filled',
        'color' => 'inherit',
        'style' => 'filled'
    ])
    @endbutton
</span>
