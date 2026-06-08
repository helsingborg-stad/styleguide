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
                    <div style="--inherit-font-size-multiplier: 1;">
                        @foreach(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as $heading)
                            @typography(['element' => $heading, 'variant' => $heading, 'classList' => ['u-margin__bottom--1']])
                                This is a {{ $heading }} title inside accordion content
                            @endtypography
                        @endforeach

                        @typography(['element' => 'p', 'variant' => 'body'])
                            This panel forces `--inherit-font-size-multiplier: 1`, so nested titles keep their uncorrected size.
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
                    <div style="--inherit-font-size-multiplier: 0.5;">
                        @foreach(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as $heading)
                            @typography(['element' => $heading, 'variant' => $heading, 'classList' => ['u-margin__bottom--1']])
                                This is a {{ $heading }} title inside accordion content
                            @endtypography
                        @endforeach

                        @typography(['element' => 'p', 'variant' => 'body'])
                            This panel forces `--inherit-font-size-multiplier: 0.5`, which applies the corrected accordion sizing while still respecting the base text-size floor.
                        @endtypography
                    </div>
                @endaccordion__item
            @endaccordion
        @endpaper
    </div>
</div>
