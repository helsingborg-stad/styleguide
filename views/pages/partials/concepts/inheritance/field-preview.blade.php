<div class="o-grid o-grid--large u-padding--3" style="background: var(--color--surface-alt); border-radius: calc(var(--border-radius) * var(--base));">
    <div class="o-grid-12 o-grid-6@md">
        <style>
            .field-demo--inherited .c-field {
                --c-field--contrast-color: var(--color--secondary-contrast);
            }

            .field-demo--inherited .c-field__inner {
                --inherit-color-background: var(--color--secondary);
            }

            .field-demo--explicit .c-field {
                --c-field--contrast-color: var(--color--primary);
            }

            .field-demo--explicit .c-field__inner {
                --inherit-color-background: var(--color--secondary);
                --c-field--background-color: var(--color--primary-contrast);
            }
        </style>

        <div class="u-padding--2 field-demo--inherited" style="background: color-mix(in srgb, var(--color--secondary) 18%, white); border-radius: calc(var(--border-radius) * var(--base));">
            @field([
                'label' => 'Inherited field background',
                'name' => 'inheritance-field-default',
                'type' => 'text',
                'placeholder' => 'Reads the inherited secondary background',
            ])
            @endfield
        </div>
    </div>

    <div class="o-grid-12 o-grid-6@md">
        <div class="u-padding--2 field-demo--explicit" style="background: color-mix(in srgb, var(--color--primary) 12%, white); border-radius: calc(var(--border-radius) * var(--base));">
            @field([
                'label' => 'Explicit field override',
                'name' => 'inheritance-field-explicit',
                'type' => 'text',
                'placeholder' => 'Uses the explicit component background',
            ])
            @endfield
        </div>
    </div>
</div>