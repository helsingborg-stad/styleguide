@button([
    'floating' => ['animate' => true, 'hover' => true],
    'text' => 'Animate + hover',
    'background' => 'default'
])
@endbutton

@button([
    'floating' => ['animate' => false, 'hover' => true],
    'text' => 'Only hover',
    'background' => 'default'
])
@endbutton

@button([
    'floating' => ['animate' => false, 'hover' => false],
    'text' => 'No hover or animate',
    'background' => 'default'
])
@endbutton