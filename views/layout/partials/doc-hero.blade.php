@php
    $title = $title ?? 'Styleguide documentation';
    $subtitle = $subtitle ?? 'A classic, readable hub for components, utilities and scripts.';
    $metaTags = $metaTags ?? [
        ['label' => 'Version 2.0'],
        ['label' => 'Public design system']
    ];
    $primaryCta = $primaryCta ?? ['label' => 'Browse components', 'href' => '/components'];
    $secondaryCta = $secondaryCta ?? ['label' => 'Setup guide', 'href' => '/setup'];
    $shortcuts = $shortcuts ?? [
        ['label' => 'Components', 'href' => '/components'],
        ['label' => 'Utilities', 'href' => '/utilities'],
        ['label' => 'Scripts', 'href' => '/script'],
        ['label' => 'Design tokens', 'href' => '/design-builder']
    ];
@endphp

@paper(['padding' => 5, 'classList' => ['u-margin__bottom--5']])
    <div class="o-grid o-grid--large u-align-items--center">
        <div class="o-grid-12 o-grid-7@lg">
            @tags([
                'tagsStyle' => 'pill',
                'tags' => $metaTags
            ])
            @endtags

            @typography(['element' => 'h1', 'variant' => 'h1', 'classList' => ['u-margin__top--2']])
                {{ $title }}
            @endtypography

            @typography(['element' => 'p', 'variant' => 'body', 'classList' => ['u-margin__top--1']])
                {{ $subtitle }}
            @endtypography

            <div class="u-margin__top--3">
                @button([
                    'text' => $primaryCta['label'],
                    'style' => 'filled',
                    'color' => 'primary',
                    'size' => 'md',
                    'attributeList' => ['onclick' => "window.location='{$primaryCta['href']}'"]
                ])
                @endbutton
                @button([
                    'text' => $secondaryCta['label'],
                    'style' => 'outlined',
                    'color' => 'default',
                    'size' => 'md',
                    'attributeList' => ['onclick' => "window.location='{$secondaryCta['href']}'"]
                ])
                @endbutton
            </div>

            @if(!empty($shortcuts))
                <div class="u-margin__top--3">
                    @typography(['element' => 'p', 'variant' => 'body', 'classList' => ['u-margin__bottom--1']])
                        Jump straight to frequently used areas:
                    @endtypography
                    <div class="o-grid o-grid--half-gutter">
                        @foreach($shortcuts as $shortcut)
                            <div class="o-grid-12 o-grid-6@sm">
                                @link(['href' => $shortcut['href'], 'classList' => ['u-display--block', 'u-border__radius--md']])
                                    {{ $shortcut['label'] }}
                                @endlink
                            </div>
                        @endforeach
                    </div>
                </div>
            @endif
        </div>

        <div class="o-grid-12 o-grid-5@lg">
            @paper(['padding' => 4, 'classList' => ['u-height--100']])
                @typography(['element' => 'h4', 'variant' => 'h4'])
                    Quick search
                @endtypography
                @typography(['element' => 'p', 'variant' => 'body', 'classList' => ['u-margin__bottom--3']])
                    Filter components or pages directly from here. Press Enter to open the first match.
                @endtypography

                @form(['action' => '/components', 'method' => 'get'])
                    @field([
                        'label' => 'Search the docs',
                        'name' => 'q',
                        'type' => 'search',
                        'placeholder' => 'Buttons, accordions, tokens...',
                        'attributeList' => ['autocomplete' => 'off']
                    ])
                    @endfield
                @endform

                <div class="u-margin__top--3">
                    @typography(['element' => 'p', 'variant' => 'body', 'classList' => ['u-margin__bottom--1']])
                        Popular destinations
                    @endtypography
                    <div class="o-grid o-grid--half-gutter">
                        @foreach($shortcuts as $shortcut)
                            <div class="o-grid-12">
                                @link(['href' => $shortcut['href'], 'classList' => ['u-display--block', 'u-padding__y--1', 'u-border__bottom--1']])
                                    {{ $shortcut['label'] }}
                                @endlink
                            </div>
                        @endforeach
                    </div>
                </div>
            @endpaper
        </div>
    </div>
@endpaper
