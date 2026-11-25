@button([
    'text' => 'Toggle drawer',
    'icon' => 'menu_open',
    'color' => 'primary',
    'attributeList' => ['popovertarget' => 'drawer-123'],
])
@endbutton
    @drawer([
        'id' => '123',
        'label' => 'Close',
        'attributeList' => ['data-component' => 'drawer'],
        'classList' => ['c-drawer--duotone', 'c-drawer--primary', 'c-drawer--duotone-secondary'],
    ])
        @slot('search')
            @form([
                'id'        => 'drawer-search-form',
                'method'    => 'get',
                'action'    => "#",
                'classList' => ['u-width--100']
                ])
                    @element([
                        'classList' => ['u-display--flex']
                    ])
                        @field([
                            'id'            => 'drawer-search-form__field',
                            'type'          => 'search',
                            'name'          => 's',
                            'required'      => false,
                            'size'          => 'sm',
                            'label'         => "What are you looking for?",
                            'placeholder'   => "What are you looking for?",
                            'hideLabel'     => true,
                            'icon'          => ['icon' => 'search'],
                            'classList'     => ['u-rounded-right--none']
                        ])
                        @endfield

                        @button([
                            'id'            => 'drawer-search-form__submit',
                            'text'          => "Search",
                            'color'         => 'default',
                            'type'          => 'submit',
                            'size'          => 'sm',
                            'attributeList' => [
                                'aria-label' => "Search",
                            ],
                            'classList' => ['u-rounded-left--none']
                        ])
                        @endbutton
                    @endelement

                @endform
        @endslot

        @slot('menu')
            @nav([
                'items' => \MunicipioStyleGuide\Navigation::getMockedMultilevel(),
                'classList' => [
                    'u-position--relative',
                    'c-nav--drawer',
                    'c-nav--dark',
                    'site-nav-mobile__primary'],
                'childItemsUrl' => '/',
                'direction' => 'vertical',
                'includeToggle' => true,
            ])
            @endnav
            @nav([
                'items' => \MunicipioStyleGuide\Navigation::getMockedTopLevel(),
                'classList' => [
                    's-nav-drawer-secondary',
                    'u-position--relative',
                    'c-nav--drawer',
                    'c-nav--dark',
                    'site-nav-mobile__secondary'],
                'childItemsUrl' => '/',
                'direction' => 'vertical',
            ])
            @endnav
        @endslot

    @enddrawer
