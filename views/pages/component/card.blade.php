@extends('layout.master')

@section('content')

    @markdown
    #Cards

    Cards are surfaces that display content and actions on a single topic. <br />

    They should be easy to scan for relevant and actionable information. Elements, like text and images, <br />
    should be placed on them in a way that clearly indicates hierarchy.
    @endmarkdown

    @doc(['slug' => 'card', 'displayParams' => false])

    <div class="grid">

        <div class="grid-s-12 grid-sm-6 grid-md-6">
            @card([
                'title' => ['text' => 'I am pretty nice a title', 'position' => 'body'],
                'byline' => ['text' => 'I am cool byline....', 'position' => 'body'],
                'content' => 'Doodily texas left rappin surfer assal horizontology mono = one craptacular bumbled-bee.',
                'hasRipple' => false
            ])

            @endcard

        </div>

        <div class="grid-s-12 grid-sm-6 grid-md-6">
            @card([
                'title' => ['text' => 'Another title with a few more words. Two lines of text.', 'position' => 'body'],
                'byline' => ['text' => 'Neglecterino nulecule four krustys flunjer parents', 'position' => 'body'],
                'buttons' => [
                    [
                        'href' => 'http://helsingborg.se',
                        'text' => 'Action button 1',
                        'attributeList' => ['js-toggle-trigger']
                    ],
                    [
                        'href' => 'http://',
                        'text' => 'Action button 2',
                        'attributeList' => ['js-toggle-trigger']
                    ]
                ]
            ])

            @endcard

        </div>
    </div>

    @enddoc

    @doc(['slug' => 'card', 'displayParams' => false])

        @markdown
        ##Position of Title and byline

        There are two positions slots available for title and byline. Top and Body.<br />
        You can also add "c-card--shadow-on-hover" to classList for a shadow effect on hover.

        @endmarkdown

        <div class="grid">

            <div class="grid-s-12 grid-sm-6 grid-md-6">
                @card([
                    'href' => 'http://styleguide.helsingborg.se/card',
                    'image' => 'https://picsum.photos/300/200?image=1016',
                    'title' => ['text' => 'Melon sierra leone bologi rutabaga', 'position' => 'top'],
                    'byline' => ['text' => 'Celery quandong swiss chard chicory', 'position' => 'top'],
                    'classList' => ['c-card--shadow-on-hover'],
                    'content' => 'Sea lettuce gumbo grape kale kombu cauliflower salsify kohlrabi okra sea lettuce
                                    broccoli celery lotus root carrot winter purslane turnip greens garlic. ',
                    'hasRipple' => false
                ])

                @endcard

            </div>

            <div class="grid-s-12 grid-sm-6 grid-md-6">
                @card([
                    'href' => 'http://styleguide.helsingborg.se/card',
                    'image' => 'https://picsum.photos/300/200?image=1071',
                    'title' => ['text' => 'Cheddar ricotta croque monsieur', 'position' => 'body'],
                    'classList' => ['c-card--shadow-on-hover'],
                    'byline' => ['text' => 'Melted cheese camembert de normandie cheese triangles', 'position' => 'body'],
                    'content' => 'Blue castello red leicester camembert de normandie. Swiss cheeseburger taleggio cheesy
                            feet who moved my cheese airedale mozzarella boursin. ',
                    'hasRipple' => false

                ])

                @endcard

            </div>
        </div>

    @enddoc

    @doc(['slug' => 'card'])

    @markdown
    ##Avatars and Icon buttons

    You can add avatar to the top title and icon buttons for ex. social sharing etc.<br />
    If you add utillity class "u-float--right" to icon classList the icons will float right.

    @endmarkdown

    <div class="grid">

        <div class="grid-s-12 grid-sm-6 grid-md-6">
            @card([
                'href' => 'http://styleguide.helsingborg.se/card',
                'title' => ['text' => 'Why not add an avatar to your card', 'position' => 'top'],
                'byline' => ['text' => 'I am a byline under a title that is friend with an avatar.', 'position' => 'top'],
                'content' => 'Gumbo beet greens corn soko endive gumbo gourd. Parsley shallot courgette tatsoi pea sprouts
                        fava bean collard greens dandelion okra wakame tomato.',
                'hasRipple' => false,
                'avatar' => [
                    'image' => 'https://picsum.photos/70/70?image=64',
                    'name' => 'Cookie Monster'
                ]
            ])

            @endcard

        </div>

        <div class="grid-s-12 grid-sm-6 grid-md-6">
            @card([
                'avatar' => [
                    'name' => 'Snowflake'
                ],
                'href' => 'http://styleguide.helsingborg.se/card',
                'title' => ['text' => 'Maybe you also need to add some cool icon-buttons', 'position' => 'top'],
                'byline' => ['text' => 'Social icons or something else...', 'position' => 'body'],
                'content' => 'Brussels sprout coriander water chestnut gourd swiss chard wakame kohlrabi beetroot carrot watercress.
                        Corn amaranth salsify bunya nuts nori azuki bean chickweed potato bell pepper artichoke.',
                'hasRipple' => false,
                'icons' => [
                    [
                        'name' => 'favorite',
                        'size' => 'lg',
                        'color' => 'primary',
                        'attributeList' => ['js-toggle-trigger'],
                        'classList' => ['u-float--right']
                    ],
                    [
                        'name' => 'forum',
                        'size' => 'lg',
                        'color' => 'primary',
                        'attributeList' => ['js-toggle-trigger'],
                        'classList' => ['u-float--right']
                    ],
                    [
                        'name' => 'place',
                        'size' => 'lg',
                        'color' => 'secondary',
                        'attributeList' => ['js-toggle-trigger'],
                        'classList' => ['u-float--right']
                    ]
                ]
            ])

            @endcard

        </div>
        <div class="grid-s-12 grid-sm-6 grid-md-6">
            @card([
                'image' => 'https://picsum.photos/300/200?image=1028',
                'title' => ['text' => 'More dynamic card with floating menus', 'position' => 'body'],
                'byline' => ['text' => 'Celery quandong swiss chard chicory', 'position' => 'body'],
                'content' => 'Look at the nice floating dropdown menu in the top right corner. Easy to add and fill with items and links.',
                'classList' => ['c-card--shadow-on-hover'],
                'hasRipple' => false,
                'buttons' => [
                    [
                        'href' => 'http://helsingborg.se',
                        'text' => 'Action button 1',
                        'attributeList' => ['js-toggle-trigger']
                    ],
                    [
                        'href' => 'http://',
                        'text' => 'Action button 2',
                        'attributeList' => ['js-toggle-trigger']
                    ]
                ],
                'dropdown' => [
                    'direction' => 'top',
                    'position' => 'bottom',
                    'items' => []
                ]
            ])

            @endcard
        </div>
        <div class="grid-s-12 grid-sm-6 grid-md-6">
            @card([
                'image' => 'https://picsum.photos/300/200?image=1021',
                'title' => ['text' => 'Melon sierra leone bologi rutabaga', 'position' => 'top'],
                'byline' => ['text' => 'Celery quandong swiss chard chicory', 'position' => 'top'],
                'content' => 'Overflow menus are usually located in the upper-right or lower-right corner of a card.',
                'classList' => ['c-card--shadow-on-hover'],
                'hasRipple' => false,
                'icons' => [
                    [
                        'name' => 'share',
                        'size' => 'lg',
                        'color' => '',
                        'attributeList' => ['js-toggle-trigger'],
                        'classList' => ['u-float--right']
                    ],
                    [
                        'name' => 'local-offer',
                        'size' => 'lg',
                        'color' => '',
                        'attributeList' => ['js-toggle-trigger'],
                        'classList' => ['u-float--right']
                    ],
                    [
                        'name' => 'place',
                        'size' => 'lg',
                        'color' => '',
                        'attributeList' => ['js-toggle-trigger'],
                        'classList' => ['u-float--right']
                    ]
                ],
                'dropdown' => [
                    'direction' => 'bottom',
                    'position' => 'top',
                'items' => []
            ]
            ])

            @endcard

        </div>
        <div class="grid-s-12 grid-sm-6 grid-md-6">
            @card([
                'top' => '<h4>JOHAN TEST</h4>',
                'bottom' => '<button  class="c-btn c-card__button c-btn__outlined--default c-btn--md" target="_top" js-toggle-single="c-btn--default__toggled" aria-pressed="false" href="http://helsingborg.se" tabindex="0" js-toggle-self="">
                                <span class="c-btn__label">
                                    ActionButton with HTML
                                </span>
                             </button>
                            <button  class="c-btn c-card__button c-btn__outlined--default c-btn--md" target="_top" js-toggle-single="c-btn--default__toggled" aria-pressed="false" href="http://helsingborg.se" tabindex="0" js-toggle-self="">
                                <span class="c-btn__label">
                                    ActionButton with HTML
                                </span>
                            </button>',


            ])

            @endcard

        </div>


    </div>

    @enddoc



@stop




