@php
    $links = $links ?? [
        ['label' => 'Components overview', 'href' => '/components'],
        ['label' => 'Utilities', 'href' => '/utilities'],
        ['label' => 'Scripts', 'href' => '/script'],
        ['label' => 'Accessibility', 'href' => '/about/accessability'],
        ['label' => 'Design tokens', 'href' => '/design-builder']
    ];
@endphp

@paper(['padding' => 4])
    @typography(['element' => 'h4', 'variant' => 'h4'])
        Need help?
    @endtypography
    @typography(['element' => 'p', 'variant' => 'body', 'classList' => ['u-margin__top--1']])
        Visit the repository for issues, or reach out to the team to propose improvements.
    @endtypography
    <div class="u-margin__top--2">
        @button([
            'text' => 'Open GitHub',
            'style' => 'basic',
            'color' => 'default',
            'size' => 'sm',
            'attributeList' => ['onclick' => "window.open('https://github.com/helsingborg-stad/styleguide', '_blank')"]
        ])
        @endbutton
    </div>
@endpaper
