@card([
    'collapsible' => false,
    'heading' => 'Inset-aware card',
    'content' => 'Resize the preview to let the card grow its own inset multiplier and pass that spacing on to the nested accordion.',
])
    @accordion([
        'list' => [
            [
                'heading' => 'Nested child inherits card inset',
                'content' => 'The child keeps the same spacing rhythm as the card body.',
            ],
            [
                'heading' => 'One public hook, many consumers',
                'content' => 'The parent does not need to rewrite the child padding formula. It only publishes the multiplier.',
            ],
        ]
    ])
    @endaccordion
@endcard

@typography(['variant' => 'meta'])
    Resize the preview to let the card resolve its own inset multiplier and keep nested components aligned.
@endtypography