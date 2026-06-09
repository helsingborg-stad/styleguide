<div style="display: grid; gap: 1.5rem; grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr)); align-items: start;">
    <div style="border: 2px dashed currentColor; padding: 1rem; min-width: 16rem;">
        @typography([
            'variant' => 'meta',
            'element' => 'p'
        ])
            Standalone accordion
        @endtypography

        @accordion([
            'list' => [
                [
                    'heading' => 'Section heading',
                    'content' => 'This accordion now scales its own inset spacing when the container grows, even without a wrapping card.'
                ],
                [
                    'heading' => 'Section heading',
                    'content' => 'The inset rhythm should visually match the card-wrapped version beside it instead of feeling tighter in larger areas.'
                ],
                [
                    'heading' => 'Section heading',
                    'content' => 'Resize the preview to verify that both implementations keep the same padding rhythm.'
                ]
            ]
        ])
        @endaccordion
    </div>

    <div style="border: 2px dashed currentColor; padding: 1rem; min-width: 16rem;">
        @typography([
            'variant' => 'meta',
            'element' => 'p'
        ])
            Accordion inside card
        @endtypography

        @card([
            'heading' => 'Inset-aware card',
            'content' => 'The card publishes its resolved inset multiplier to nested surfaces.',
            'collapsible' => false,
        ])
            @accordion([
                'list' => [
                    [
                        'heading' => 'Section heading',
                        'content' => 'Nested accordion sections should remain aligned with the card body spacing as the container grows.'
                    ],
                    [
                        'heading' => 'Section heading',
                        'content' => 'The shared inset multiplier mixin now keeps this version and the standalone version on the same spacing rhythm.'
                    ],
                    [
                        'heading' => 'Section heading',
                        'content' => 'Resize the preview and compare it with the standalone example beside it.'
                    ]
                ]
            ])
            @endaccordion
        @endcard
    </div>
</div>
