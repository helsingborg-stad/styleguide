@typography([
    "variant" => "h3"
])
    Toggle buttons with interchangable labels & icons
@endtypography

@button([
    'icon' => 'format_align_left',
    'toggle' => true,
    'size' => 'md',
    'color' => 'primary',
    'style' => 'filled',
    'attributeList' => [
        'data-toggle-icon' => 'close' //Icon id
    ]
])
@endbutton

@button([
    'text' => 'Click me!',
    'toggle' => true,
    'size' => 'md',
    'color' => 'primary',
    'style' => 'filled',
    'attributeList' => [
        'data-toggle-label' => 'Close', //New label
    ]
])
@endbutton

@button([
    'text' => 'Open',
    'icon' => 'format_align_center',
    'toggle' => true,
    'size' => 'md',
    'color' => 'secondary',
    'style' => 'filled',
    'reversePositions' => true,
    'attributeList' => [
        'data-toggle-label' => 'Close', //New label
        'data-toggle-icon' => 'close' //Icon id
    ]
])
@endbutton
