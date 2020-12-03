
@card([
    'attributeList' => [
        'js-pagination-target' => ''
    ]
])
    <div class="c-card__header">
        @typography([
            'element' => "h4"
        ])
            Simple pagination
        @endtypography
    </div>


    @collection(['attributeList' => ['js-pagination-container' => '']])
        @collection__item(['attributeList' => ['js-pagination-item' => '']])
            Item 1
        @endcollection__item

        @collection__item(['attributeList' => ['js-pagination-item' => '']])
            Item 2
        @endcollection__item

        @collection__item(['attributeList' => ['js-pagination-item' => '']])
            Item 3
        @endcollection__item
    @endcollection

    @pagination([
        'list' => [
            ['href' => '?pagination=1', 'label' => 'Page 1'],
        ],
        'current' => 1,
        'useJS' => true,
        'perPage' => 2,
    ])
    @endpagination
@endcard
