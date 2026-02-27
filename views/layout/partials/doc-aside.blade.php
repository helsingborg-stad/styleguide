@php
    $links = $links ?? [
        ['label' => 'Components overview', 'href' => '/components'],
        ['label' => 'Utilities', 'href' => '/utilities'],
        ['label' => 'Scripts', 'href' => '/script'],
        ['label' => 'Accessibility', 'href' => '/about/accessability'],
        ['label' => 'Design tokens', 'href' => '/design-builder']
    ];
@endphp

@if(isset($similarComponentItems) && is_array($similarComponentItems) && !empty($similarComponentItems))
    @paper(['padding' => 4, 'classList' => ['u-margin__bottom--3']])
        @typography(['element' => 'h4', 'variant' => 'h4'])
            Similar components
        @endtypography

        <div class="o-grid o-grid--small o-grid--gutters u-margin__top--2">
            @foreach($similarComponentItems as $similarComponentItem)
                <div class="o-grid-6">
                    @button([
                        'text' => $similarComponentItem['name'],
                        'href' => $similarComponentItem['href'],
                        'icon' => $similarComponentItem['icon'] ?? 'widgets',
                        'type' => 'outlined',
                        'color' => 'default',
                        'size' => 'sm',
                        'fullWidth' => true,
                    ])
                    @endbutton
                </div>
            @endforeach
        </div>
    @endpaper
@endif

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
