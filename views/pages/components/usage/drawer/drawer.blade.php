 <a class="c-button c-button__filled c-button__filled--default c-button--md" target="_top" data-js-toggle-trigger="drawer" type="button" href="#" data-uid="637791fe94417">
    <span class="c-button__label">
        Toggle drawer
    </span>
</a>

@drawer([
    'label' => 'Close',
    'attributeList' => [
        'data-js-toggle-item' => 'drawer',
        'data-js-toggle-class' => 'is-open',
        ],
])
    @slot('search')
        @form([
        'id'        => 'mobile-search-form',
        'method'    => 'get',
        'action'    => '#',
        ])
            @group(['direction' => 'horizontal', 'classList' => ['u-margin--auto']])
                @field([
                    'id'            => 'mobile-search-form--field',
                    'type'          => 'search',
                    'name'          => 's',
                    'required'      => false,
                    'size'          => 'sm',
                    'radius'        => 'sm',
                    'borderless'    => true,
                    'label'         => 'Search',
                    'hideLabel'     => true,
                    'icon'          => ['icon' => 'search'],
                    'classList'     => [
                        'u-flex-grow--1',
                        'u-box-shadow--1',
                        'u-rounded__left--8'
                    ]
                ])
                @endfield

                @button([
                    'id'            => 'mobile-search-form--submit',
                    'text'          => 'Search',
                    'color'         => 'default',
                    'type'          => 'submit',
                    'size'          => 'sm',
                    'attributeList' => [
                        'id'            => 'mobile-search-form--submit'
                    ],

                ])
                @endbutton
            @endgroup
        @endform
    @endslot

    @slot('menu')
        @nav([
            'items' => \HbgStyleGuide\Navigation::getMockedTopLevel(),
            'classList' => [
                'u-position--relative', 
                'c-nav--drawer',           
                'c-nav--dark',
                'site-nav-mobile__primary'],
            'childItemsUrl' => '/', 
            'direction' => 'vertical',
        ])
        @endnav 
    @endslot

@enddrawer