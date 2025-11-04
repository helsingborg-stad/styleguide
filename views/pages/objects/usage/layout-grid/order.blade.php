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
        Usage example: o-layout-grid--order-4 (placed on the blue child that normally is the first element)
    @endtypography
    @element([
        'classList' => [
            'o-layout-grid',
            'o-layout-grid--cols-4',
            'o-layout-grid--gap-2'
        ],
        'attributeList' => [
            'style' => 'width: 400px;'
        ]
    ])  
        <div class="o-layout-grid--order-4" style="height: 100px; background-color: blue;"></div>
        <div style="height: 100px; background-color: green;"></div>
        <div style="height: 100px; background-color: red;"></div>
        <div style="height: 100px; background-color: yellow;"></div>
    @endelement
@endelement