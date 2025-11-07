@element([
    'classList' => [
        'u-margin__top--6'
    ]
])
    @typography([
        'element' => 'h3',
        'variant' => 'h4',
        'classList' => [
            'u-margin__bottom--3'
        ]
    ])
        Usage example: o-layout-grid--justify-start (placed on blue child)
    @endtypography
    @element([
        'classList' => [
            'o-layout-grid',
            'o-layout-grid--cols-2',
            'o-layout-grid--gap-2'
        ],
        'attributeList' => [
            'style' => 'width: 208px;'
        ]
    ])  
        <div class="o-layout-grid--justify-start" style="height: 100px; width: 100px; background-color: blue;"></div>
        <div style="height: 100px; background-color: green;"></div>
        <div style="height: 100px; background-color: red;"></div>
        <div style="height: 100px; background-color: yellow;"></div>
    @endelement
@endelement

@element([
    'classList' => [
        'u-margin__top--6'
    ]
])
    @typography([
        'element' => 'h3',
        'variant' => 'h4',
        'classList' => [
            'u-margin__bottom--3'
        ]
    ])
        Usage example: o-layout-grid--justify-center (placed on blue child)
    @endtypography
    @element([
        'classList' => [
            'o-layout-grid',
            'o-layout-grid--cols-2',
            'o-layout-grid--gap-2'
        ],
        'attributeList' => [
            'style' => 'width: 208px;'
        ]
    ])  
        <div class="o-layout-grid--justify-center o-layout-grid--col-span-2" style="width: 100px; height: 100px; background-color: blue;"></div>
        <div style="height: 100px; background-color: green;"></div>
        <div style="height: 100px; background-color: red;"></div>
        <div style="height: 100px; background-color: yellow;"></div>
    @endelement
@endelement

@element([
    'classList' => [
        'u-margin__top--6'
    ]
])
    @typography([
        'element' => 'h3',
        'variant' => 'h4',
        'classList' => [
            'u-margin__bottom--3'
        ]
    ])
        Usage example: o-layout-grid--justify-end (placed on blue child)
    @endtypography
    @element([
        'classList' => [
            'o-layout-grid',
            'o-layout-grid--cols-2',
            'o-layout-grid--gap-2'
        ],
        'attributeList' => [
            'style' => 'width: 208px;'
        ]
    ])  
        <div class="o-layout-grid--justify-end o-layout-grid--col-span-2" style="width: 100px; height: 100px; background-color: blue;"></div>
        <div style="height: 100px; background-color: green;"></div>
        <div style="height: 100px; background-color: red;"></div>
        <div style="height: 100px; background-color: yellow;"></div>
    @endelement
@endelement

@element([
    'classList' => [
        'u-margin__top--6'
    ]
])
    @typography([
        'element' => 'h3',
        'variant' => 'h4',
        'classList' => [
            'u-margin__bottom--3'
        ]
    ])
        Usage example: o-layout-grid--justify-stretch (placed on blue child)
    @endtypography
    @element([
        'classList' => [
            'o-layout-grid',
            'o-layout-grid--cols-2',
            'o-layout-grid--gap-2'
        ],
        'attributeList' => [
            'style' => 'width: 208px;'
        ]
    ])  
        <div class="o-layout-grid--justify-stretch" style="height: 100px; background-color: blue;"></div>
        <div style="height: 100px; background-color: green;"></div>
        <div style="height: 100px; background-color: red;"></div>
        <div style="height: 100px; background-color: yellow;"></div>
    @endelement
@endelement
