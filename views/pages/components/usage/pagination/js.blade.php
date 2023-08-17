
@card([
    'attributeList' => [
        'data-js-pagination-target' => ''
    ],
    'classList' => ['u-margin__bottom--8']
])
    <div class="c-card__header">
        @typography([
            'element' => "h4"
        ])
            Simple pagination
        @endtypography
        @typography([
        ])
            Showing all pages in the pagination at the same time.
        @endtypography
    </div>


    @collection(['attributeList' => ['data-js-pagination-container' => '']])
        @collection__item(['attributeList' => ['data-js-pagination-item' => '']])
            Item 1
        @endcollection__item

        @collection__item(['attributeList' => ['data-js-pagination-item' => '']])
            Item 2
        @endcollection__item

        @collection__item(['attributeList' => ['data-js-pagination-item' => '']])
            Item 3
        @endcollection__item
        @collection__item(['attributeList' => ['data-js-pagination-item' => '']])
            Item 4
        @endcollection__item
        @collection__item(['attributeList' => ['data-js-pagination-item' => '']])
            Item 5
        @endcollection__item
        @collection__item(['attributeList' => ['data-js-pagination-item' => '']])
            Item 6
        @endcollection__item
        @collection__item(['attributeList' => ['data-js-pagination-item' => '']])
            Item 7
        @endcollection__item
        @collection__item(['attributeList' => ['data-js-pagination-item' => '']])
            Item 8
        @endcollection__item
        @collection__item(['attributeList' => ['data-js-pagination-item' => '']])
            Item 9
        @endcollection__item
        
    @endcollection

    @pagination([
        'current' => 1,
        'useJS' => true,
        'perPage' => 1,
        'keepDOM' => true,
    ])
    @endpagination
@endcard



@card([
    'attributeList' => [
        'data-js-pagination-target' => ''
    ],
    'classList' => [
        'u-margin__bottom--8'
    ]
])
    <div class="c-card__header">
        @typography([
            'element' => "h4"
        ])
            Pagination with pagesToShow attribute.
        @endtypography
        @typography([
        ])
            Takes an even number (or closest even number) and only show that amount of pages (in addition to the current page).
        @endtypography
    </div>


    @collection(['attributeList' => ['data-js-pagination-container' => '']])
        @collection__item(['attributeList' => ['data-js-pagination-item' => '']])
            Item 1
        @endcollection__item

        @collection__item(['attributeList' => ['data-js-pagination-item' => '']])
            Item 2
        @endcollection__item

        @collection__item(['attributeList' => ['data-js-pagination-item' => '']])
            Item 3
        @endcollection__item
        @collection__item(['attributeList' => ['data-js-pagination-item' => '']])
            Item 4
        @endcollection__item
        @collection__item(['attributeList' => ['data-js-pagination-item' => '']])
            Item 5
        @endcollection__item
        @collection__item(['attributeList' => ['data-js-pagination-item' => '']])
            Item 6
        @endcollection__item
        @collection__item(['attributeList' => ['data-js-pagination-item' => '']])
            Item 7
        @endcollection__item
        @collection__item(['attributeList' => ['data-js-pagination-item' => '']])
            Item 8
        @endcollection__item
        @collection__item(['attributeList' => ['data-js-pagination-item' => '']])
            Item 9
        @endcollection__item
        
    @endcollection

    @pagination([
        'current' => 1,
        'useJS' => true,
        'perPage' => 1,
        'pagesToShow' => 4,
        'keepDOM' => true,
    ])
    @endpagination
@endcard

@card([
    'attributeList' => [
        'data-js-pagination-target' => ''
    ]
])
    <div class="c-card__header">
        @typography([
            'element' => "h4"
        ])
            Pagination with pagesToShow attribute.
        @endtypography
        @typography([
        ])
            Takes an even number (or closest even number) and only show that amount of pages (in addition to the current page).
        @endtypography
    </div>
                  @select([
                        'label' => 'Sort by',
                        'hidePlaceholder' => true,
                        'required' => true,
                        'preselected' => 'random',
                        'size' => 'sm',
                        'limitWidth' => true,
                        'options' => [
                            'default' => 'Default order',
                            'alphabetical' => 'Alphabetical',
                            'random' => 'Random',
                        ],
                        'attributeList' => [
                            'data-js-pagination-sort' => '',
                        ],
                        'classList' => [
                            'u-margin__bottom--4',
                        ],
                    ])
                    @endselect

    @collection(['attributeList' => ['data-js-pagination-container' => '']])
       @collection__item(['attributeList' => ['data-js-pagination-item' => '', 'data-js-pagination-item-title' => '8']])
            Item 8
        @endcollection__item
        @collection__item(['attributeList' => ['data-js-pagination-item' => '', 'data-js-pagination-item-title' => '9']])
            Item 9
        @endcollection__item
        @collection__item(['attributeList' => ['data-js-pagination-item' => '', 'data-js-pagination-item-title' => '3']])
            Item 3
        @endcollection__item
        @collection__item(['attributeList' => ['data-js-pagination-item' => '', 'data-js-pagination-item-title' => '4']])
            Item 4
        @endcollection__item
        @collection__item(['attributeList' => ['data-js-pagination-item' => '', 'data-js-pagination-item-title' => '5']])
            Item 5
        @endcollection__item
                @collection__item(['attributeList' => ['data-js-pagination-item' => '', 'data-js-pagination-item-title' => '1']])
            Item 1
        @endcollection__item

        @collection__item(['attributeList' => ['data-js-pagination-item' => '', 'data-js-pagination-item-title' => '2']])
            Item 2
        @endcollection__item
        @collection__item(['attributeList' => ['data-js-pagination-item' => '', 'data-js-pagination-item-title' => '6']])
            Item 6
        @endcollection__item
        @collection__item(['attributeList' => ['data-js-pagination-item' => '', 'data-js-pagination-item-title' => '7']])
            Item 7
        @endcollection__item
        
    @endcollection

    @pagination([
        'current' => 1,
        'useJS' => true,
        'perPage' => 1,
        'pagesToShow' => 4,
        'keepDOM' => true,
    ])
    @endpagination
@endcard

