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
        Usage example: o-layout-grid--grid-auto-rows-auto
    @endtypography
    @element([
        'classList' => [
            'o-layout-grid',
            'o-layout-grid--cols-2',
            'o-layout-grid--gap-2',
            'o-layout-grid--grid-auto-rows-auto'
        ],
        'attributeList' => [
            'style' => 'width: 208px;'
        ]
    ])  
        <div style="background-color: blue; height: 20px;">Short</div>
        <div style="background-color: green; height: 60px;">Taller</div>
        <div style="background-color: red; height: 40px;">Medium</div>
        <div style="background-color: yellow; height: 80px;">Tallest</div>
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
        Usage example: o-layout-grid--grid-auto-rows-min-content
    @endtypography
    @element([
        'classList' => [
            'o-layout-grid',
            'o-layout-grid--cols-2',
            'o-layout-grid--gap-2',
            'o-layout-grid--grid-auto-rows-min-content'
        ],
        'attributeList' => [
            'style' => 'width: 208px;'
        ]
    ])  
        <div style="background-color: blue; min-height: 20px;">Short</div>
        <div style="background-color: green; min-height: 60px;">Taller</div>
        <div style="background-color: red; min-height: 40px;">Medium</div>
        <div style="background-color: yellow; min-height: 80px;">Tallest</div>
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
        Usage example: o-layout-grid--grid-auto-rows-max-content
    @endtypography
    @element([
        'classList' => [
            'o-layout-grid',
            'o-layout-grid--cols-2',
            'o-layout-grid--gap-2',
            'o-layout-grid--grid-auto-rows-max-content'
        ],
        'attributeList' => [
            'style' => 'width: 208px;'
        ]
    ])  
        <div style="background-color: blue; max-height: 20px; overflow: hidden;">Short</div>
        <div style="background-color: green; max-height: 60px; overflow: hidden;">Taller</div>
        <div style="background-color: red; max-height: 40px; overflow: hidden;">Medium</div>
        <div style="background-color: yellow; max-height: 80px; overflow: hidden;">Tallest</div>
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
        Usage example: o-layout-grid--grid-auto-rows-equal
    @endtypography
    @element([
        'classList' => [
            'o-layout-grid',
            'o-layout-grid--cols-2',
            'o-layout-grid--gap-2',
            'o-layout-grid--grid-auto-rows-equal'
        ],
        'attributeList' => [
            'style' => 'width: 208px;'
        ]
    ])  
        <div style="background-color: blue;">Equal</div>
        <div style="background-color: green;">Equal</div>
        <div style="background-color: red;">Equal</div>
        <div style="background-color: yellow;">Equal</div>
    @endelement
@endelement
