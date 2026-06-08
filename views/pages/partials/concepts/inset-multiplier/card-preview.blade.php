<div style="width: 70%; resize: horizontal; overflow: auto; border: 2px solid currentColor; padding: 1rem;">
    @card([
        'collapsible' => false,
        'heading' => 'Inset-aware card',
        'content' => 'Resize the container to let the card grow its own inset multiplier and pass that spacing on to the nested accordion.',
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
</div>

@typography(['variant' => 'meta'])
    The card resolves its own inset multiplier, then publishes that value so nested components stay aligned.
@endtypography