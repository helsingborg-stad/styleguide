@foreach(['basic', 'outlined', 'filled'] as $style)
<div style="display: flex; gap: 1rem; flex-wrap: wrap; align-items: center; margin-bottom: 2rem;">
    @button([
        'text' => 'Primary (href)',
        'color' => 'primary',
        'style' => $style,
        'href' => 'https://helsingborg.se',
        'shape' => 'pill',
        'classList' => [
            'u-margin--0'
        ]
    ]) 
    @endbutton

    @button([
        'text' => 'Secondary',
        'color' => 'secondary',
        'style' => $style,
        'shape' => 'pill',
        'classList' => [
            'u-margin--0'
        ]
    ])
    @endbutton

    @button([
        'text' => 'Default',
        'color' => 'default',
        'style' => $style,
        'shape' => 'pill',
        'classList' => [
            'u-margin--0'
        ]
    ])
    @endbutton


    @button([
        'color' => 'primary',
        'style' => $style,
        'href' => 'https://helsingborg.se',
        'icon' => 'home',
        'reversePositions' => 'true',
        'shape' => 'pill',
        'classList' => [
            'u-margin--0'
        ]
    ])
    @endbutton
    </div>
@endforeach
