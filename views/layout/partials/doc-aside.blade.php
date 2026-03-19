@if(isset($similarComponentItems) && is_array($similarComponentItems) && !empty($similarComponentItems))
    @paper(['padding' => 4, 'classList' => ['u-margin__bottom--3']])
        @typography(['element' => 'h4', 'variant' => 'h4'])
            Similar components
        @endtypography

        <div class="o-grid o-grid--small o-grid--gutters u-margin__top--2">
            @foreach($similarComponentItems as $similarComponentItem)
                <div class="o-grid-4@sm o-grid-3@md">
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
