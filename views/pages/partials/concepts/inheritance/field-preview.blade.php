<div class="o-grid o-grid--large u-padding--3" style="--inherit-color-background: var(--color--primary-contrast); background: var(--color--surface-alt); border-radius: calc(var(--border-radius) * var(--base));">
    <div class="o-grid-12 o-grid-6@md">
        @field([
            'label' => 'Inherited field background',
            'name' => 'inheritance-field-default',
            'type' => 'text',
            'placeholder' => 'Reads the inherited background',
        ])
        @endfield
    </div>

    <div class="o-grid-12 o-grid-6@md">
        @field([
            'label' => 'Explicit field override',
            'name' => 'inheritance-field-explicit',
            'type' => 'text',
            'placeholder' => 'Uses the component override',
            'attributeList' => [
                'style' => '--c-field--background-color: var(--color--surface);',
            ],
        ])
        @endfield
    </div>
</div>