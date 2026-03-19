@if(isset($similarComponentItems) && is_array($similarComponentItems) && !empty($similarComponentItems))
    @paper(['padding' => 4, 'classList' => ['u-margin__bottom--3']])
        @typography(['element' => 'h4', 'variant' => 'h4'])
            Similar components
        @endtypography
        <div class="similar-components-flex u-display--flex u-flex-wrap u-gap--2 u-margin__top--2">
            @foreach($similarComponentItems as $similarComponentItem)
                @button([
                    'text' => $similarComponentItem['name'],
                    'href' => $similarComponentItem['href'],
                    'icon' => $similarComponentItem['icon'] ?? 'widgets',
                    'type' => 'outlined',
                    'color' => 'default',
                    'size' => 'sm',
                    'classList' => ['u-margin--0', 'similar-components-btn']
                ])
                @endbutton
            @endforeach
        </div>
    @endpaper
@endif
