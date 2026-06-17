
@card([
    'classList' => ['c-card--panel']
])
    @card__header()
        @typography([
            'element' => 'h2',
            'variant' => 'h6',
            'classList' => [
                'module-title',
                'u-margin--0'
            ]
        ])
            Read more about this topic
        @endtypography
    @endcard__header

    @collection([
        'bordered' => true,
        'sharpTop' => true
    ])
      @for ($i = 0; $i < 4; $i++)
        @collection__item([
            'icon' => 'arrow_forward',
            'link' => '#',
            'attributeList' => [
                'id' => 'item-52147-0',
                'aria-labelledby' => 'item-52147-0-title'
            ]
        ])
            @typography([
                'element' => 'h2',
                'variant' => 'h4',
                'attributeList' => [
                    'id' => 'item-52147-0-title'
                ]
            ])
                Item label
            @endtypography
        @endcollection__item
      @endfor
    @endcollection
@endcard