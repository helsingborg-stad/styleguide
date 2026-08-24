
@card([
    'attributeList' => [
        'data-js-pagination-target' => ''
    ],
    'classList' => ['u-margin__bottom--8']
])
    @card__header()
        @typography([
            'element' => "h4"
        ])
            Simple pagination
        @endtypography
        @typography([
        ])
            Showing all pages in the pagination at the same time.
        @endtypography
    @endcard__header
    @card__body()
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
    @endcard__body
@endcard

@card([
    'attributeList' => [
        'data-js-pagination-target' => '',
        'data-js-pagination-async' => '',
        'data-async-pagination-example' => 'true'
    ],
    'classList' => ['u-margin__bottom--8']
])
    @card__header()
        @typography([
            'element' => "h4"
        ])
            Async rendered pagination items
        @endtypography
        @typography([])
            Items are injected into the pagination container after initialization using script.
        @endtypography
    @endcard__header
    @card__body()
        @collection([
            'attributeList' => [
                'data-js-pagination-container' => ''
            ]
        ])
        @endcollection

        @pagination([
            'current' => 1,
            'useJS' => true,
            'perPage' => 2,
            'pagesToShow' => 4,
            'keepDOM' => true,
        ])
        @endpagination
    @endcard__body
@endcard

<script>
    document.addEventListener('DOMContentLoaded', () => {
        const asyncExample = document.querySelector('[data-async-pagination-example="true"]');
        if (!(asyncExample instanceof HTMLElement)) {
            return;
        }

        const listContainer = asyncExample.querySelector('[data-js-pagination-container]');
        if (!(listContainer instanceof HTMLElement)) {
            return;
        }

        const createItem = (number) => {
            const item = document.createElement('div');
            item.setAttribute('data-js-pagination-item', '');
            item.setAttribute('data-js-pagination-item-title', String(number));
            item.textContent = `Async item ${number}`;

            return item;
        };

        const delay = (milliseconds) => new Promise((resolve) => {
            setTimeout(resolve, milliseconds);
        });

        const renderAsyncItems = async () => {
            await delay(4000);

            [1, 2, 3, 4].forEach((number) => {
                listContainer.appendChild(createItem(number));
            });

            await delay(600);

            [5, 6, 7, 8].forEach((number) => {
                listContainer.appendChild(createItem(number));
            });
        };

        renderAsyncItems();
    }, { once: true });
</script>



@card([
    'attributeList' => [
        'data-js-pagination-target' => ''
    ],
    'classList' => [
        'u-margin__bottom--8'
    ]
])
    @card__header()
        @typography([
            'element' => "h4"
        ])
            Pagination with pagesToShow attribute.
        @endtypography
        @typography([
        ])
            Takes an even number (or closest even number) and only show that amount of pages (in addition to the current page).
        @endtypography
    @endcard__header
    @card__body()
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
    @endcard__body
@endcard

@card([
    'attributeList' => [
        'data-js-pagination-target' => ''
    ]
])
    @card__header()
        @typography([
            'element' => "h4"
        ])
            Pagination with pagesToShow attribute.
        @endtypography
        @typography([
        ])
            Takes an even number (or closest even number) and only show that amount of pages (in addition to the current page).
        @endtypography
    @endcard__header
    @card__body()
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
    @endcard__body
@endcard
