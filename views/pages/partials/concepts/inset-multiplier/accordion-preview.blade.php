<div style="--inherit-inset-multiplier: 1.5; max-width: 32rem; margin-inline: auto; border: 1px dashed var(--color--surface-border); padding: 1rem;">
    @accordion([
        'list' => [
            [
                'heading' => 'Inherited section spacing',
                'content' => 'This accordion uses the parent inset multiplier to grow its horizontal and vertical padding.',
            ],
            [
                'heading' => 'Same component, larger inset',
                'content' => 'Only the public inherit variable changes. The component keeps its own spacing formulas.',
            ],
        ]
    ])
    @endaccordion
</div>

@typography(['variant' => 'meta'])
    The wrapper publishes the shared inset rhythm. The accordion only consumes it.
@endtypography