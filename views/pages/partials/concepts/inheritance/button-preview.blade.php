<div class="u-padding--3" style="--inherit-color-background: var(--color--primary); --inherit-color-contrast: var(--color--primary-contrast); --inherit-color-background-hover: var(--color--primary-border); --inherit-color-background-active: var(--color--primary-alt); background: var(--color--surface-alt); border-radius: calc(var(--border-radius) * var(--base));">
    @button([
        'text' => 'Inherited default button',
        'style' => 'filled',
        'color' => 'default',
        'classList' => ['u-margin__right--2', 'u-margin__bottom--2'],
    ])
    @endbutton

    @button([
        'text' => 'Explicit override wins',
        'style' => 'filled',
        'color' => 'default',
        'classList' => ['u-margin__bottom--2'],
        'attributeList' => [
            'style' => '--c-button--color--surface-alt: var(--color--secondary); --c-button--color--surface-contrast: var(--color--secondary-contrast); --c-button--color--surface-border: var(--color--secondary-border);',
        ],
    ])
    @endbutton
</div>