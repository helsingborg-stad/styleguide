<style>
    .local-customization-demo {
        background: linear-gradient(135deg, var(--color--primary) 0%, color-mix(in srgb, var(--color--primary) 72%, black) 100%);
        border-radius: calc(var(--border-radius) * var(--base));
        overflow: hidden;
    }

    .local-customization-demo .c-segment__image::before {
        background: linear-gradient(135deg, color-mix(in srgb, var(--color--secondary) 18%, transparent) 0%, transparent 60%);
        content: "";
        inset: 0;
        position: absolute;
    }

    .local-customization-demo .c-segment__content {
        position: relative;
        z-index: 1;
    }
</style>

<section class="c-segment c-segment--full-width c-segment--text-light c-segment--alignment-left c-segment--has-overlay local-customization-demo">
    <div class="c-segment__image"></div>

    <div class="o-container o-container--content c-segment__content">
        <div class="c-segment__padder">
            @typography(['element' => 'h2', 'variant' => 'h2', 'classList' => ['c-segment__title', 'u-margin__bottom--1']])
                One scoped button set in a full view
            @endtypography

            @typography(['element' => 'p', 'variant' => 'body', 'classList' => ['c-segment__text']])
                The section forces a readable inherited contrast for the buttons. The scope wrapper marks this rendered button set as one local customization target for Design Builder.
            @endtypography

            <div class="c-segment__buttons">
                @scope(['name' => 'campaign-hero'])
                    @button([
                        'text' => 'Primary',
                        'style' => 'filled',
                        'color' => 'primary',
                        'classList' => ['u-margin__right--2', 'u-margin__bottom--2'],
                    ])
                    @endbutton

                    @button([
                        'text' => 'Secondary',
                        'style' => 'filled',
                        'color' => 'secondary',
                        'classList' => ['u-margin__right--2', 'u-margin__bottom--2'],
                    ])
                    @endbutton

                    @button([
                        'text' => 'Default',
                        'style' => 'filled',
                        'color' => 'default',
                        'classList' => ['u-margin__bottom--2'],
                    ])
                    @endbutton
                @endscope
            </div>
        </div>
    </div>
</section>