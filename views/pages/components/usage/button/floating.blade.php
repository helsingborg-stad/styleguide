@button([
    'floating' => ['animate' => true, 'hover' => true],
    'text' => 'Animate + hover',
])
@endbutton

@button([
    'floating' => ['animate' => false, 'hover' => true],
    'text' => 'Only hover',
])
@endbutton

@button([
    'floating' => ['animate' => false, 'hover' => false],
    'text' => 'No hover or animate',
])
@endbutton