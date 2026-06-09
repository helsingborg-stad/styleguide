<div class="o-grid o-grid--large">
    <div class="o-grid-12 o-grid-6@md">
        @typography(['element' => 'h4', 'variant' => 'h4', 'classList' => ['u-margin__bottom--1']])
            No correction
        @endtypography

        @paper(['padding' => 0])
            @accordion([])
                @accordion__item([
                    'heading' => 'No correction',
                ])
                    <div style="--c-typography--h1-font-size: var(--c-typography--h1-font-size-default); --c-typography--h2-font-size: var(--c-typography--h2-font-size-default); --c-typography--h3-font-size: var(--c-typography--h3-font-size-default); --c-typography--h4-font-size: var(--c-typography--h4-font-size-default); --c-typography--h5-font-size: var(--c-typography--h5-font-size-default); --c-typography--h6-font-size: var(--c-typography--h6-font-size-default);">
                        @foreach(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as $heading)
                            @typography(['element' => $heading, 'variant' => $heading, 'classList' => ['u-margin__bottom--1']])
                                This is a {{ $heading }} title inside accordion content
                            @endtypography
                        @endforeach

                        @typography(['element' => 'p', 'variant' => 'body'])
                            This panel resets the accordion typography variables to their default title sizes, so nested headings keep their uncorrected scale.
                        @endtypography
                    </div>
                @endaccordion__item
            @endaccordion
        @endpaper
    </div>

    <div class="o-grid-12 o-grid-6@md">
        @typography(['element' => 'h4', 'variant' => 'h4', 'classList' => ['u-margin__bottom--1']])
            Corrected
        @endtypography

        @paper(['padding' => 0])
            @accordion([])
                @accordion__item([
                    'heading' => 'Corrected',
                ])
                    <div>
                        @foreach(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as $heading)
                            @typography(['element' => $heading, 'variant' => $heading, 'classList' => ['u-margin__bottom--1']])
                                This is a {{ $heading }} title inside accordion content
                            @endtypography
                        @endforeach

                        @typography(['element' => 'p', 'variant' => 'body'])
                            This panel uses the accordion defaults, which publish a compressed heading scale on the built-in type scale.
                        @endtypography
                    </div>
                @endaccordion__item
            @endaccordion
        @endpaper
    </div>
</div>
