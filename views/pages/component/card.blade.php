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
                        'attributeList' => ['js-toggle-trigger'],
                        'color' => 'primary'
                    ],
                    [
                        'href' => 'http://',
                        'text' => 'Action button 2',
                        'attributeList' => ['js-toggle-trigger'],
                        'color' => 'secondary'
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

        @markdown
            ##Floating menus as dropdown

        A menu displays a list of choices on a temporary surface. They appear when users interact with
        a button, action, or other control.

        @endmarkdown


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
                        'attributeList' => ['js-toggle-trigger'],
                        'color' => 'primary'
                    ],
                    [
                        'href' => 'http://',
                        'text' => 'Action button 2',
                        'attributeList' => ['js-toggle-trigger'],
                        'color' => 'secondary'
                    ]
                ],
                'dropdown' => [
                    'direction' => 'top',
                    'position' => 'bottom',
                    'items' => [
                        ['text' => 'Apple', 'link' => '#'],
                        ['text' => 'Orange', 'link' => '#'],
                        ['text' => 'Pear', 'link' => '#'],
                        ['text' => 'Melon', 'link' => '#'],
                        ['text' => 'Lemmon', 'link' => '#']
                    ]
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

                    ],
                    [
                        'name' => 'local-offer',
                        'size' => 'lg',
                        'color' => '',

                    ],
                    [
                        'name' => 'place',
                        'size' => 'lg',
                        'color' => '',
                        'attributeList' => ['js-toggle-trigger'],

                    ]
                ],
                'dropdown' => [
                    'direction' => 'bottom',
                    'position' => 'top',
                    'items' => [
                        ['text' => 'Apple', 'link' => '#'],
                        ['text' => 'Orange', 'link' => '#'],
                        ['text' => 'Pear', 'link' => '#'],
                        ['text' => 'Melon', 'link' => '#'],
                        ['text' => 'Lemmon', 'link' => '#']
                    ]
                ]
            ])

            @endcard

        </div>


        @markdown
        ##Build cards in slot

        There is so many ways to use our components and if you want more control over the card appearance<br />
        you can with ease build and customize your card by using the different components. Though you loose the charm
        of writing less code but you gain more control of the look. The example below is one of those.
        @endmarkdown


        <div class="grid-s-12 grid-sm-6 grid-md-6">
            @card([
            ])

                @image([
                    'src' => "https://picsum.photos/300/200?image=1004",
                    'alt' => "I'm a Image build with the image component",
                    'classList' => ["c-card__image"]
                ])
                @endimage

                @typography([
                    'variant' => "h3",
                        'element' => "h3",
                        'classList' => ["c-card__title"]
                    ])
                        I'm a Title created with Typography component
                @endtypography

                @heading([
                    'label' => 'I am a byline, created with the heading component',
                    'level' => 4
                ])
                @endbutton

                This nice text is just plain text wich is not createcd by any component. But you can use the
                typography component.

                <br /><br />
                @button([
                    'href' => "#",
                    'text' => "Button component",
                    'toggle' => true,
                    'isOutlined' => false,
                    'color' => "primary",
                    'attributeList' => ['tabindex' => "1"],
                    'classList' => ["c-button__button"]
                ])
                @endbutton


                @button([
                    'href' => "#",
                    'text' => "Button component",
                    'toggle' => true,
                    'isOutlined' => false,
                    'color' => "secondary",
                    'attributeList' => ['tabindex' => "1"],
                    'classList' => ["c-button__button"]
                ])
                @endbutton

            @endcard
        </div>
        <div class="grid-s-12 grid-sm-6 grid-md-6">
            @card([
            ])

            @typography([
                'variant' => "h3",
                'element' => "h3",
                'classList' => ["c-card__title"]
            ])
                I'm a Title created with Typography component
            @endtypography

            @heading([
                'label' => 'I am a byline, created with the heading component',
                'level' => 4
            ])
            @endbutton

            Sea lettuce gumbo grape kale kombu cauliflower salsify kohlrabi okra sea lettuce broccoli
            @image([
            'src'=> "https://picsum.photos/100/100?image=1004",
            'alt' => "This is a image",
            'caption' => "Hi I am a caption",
            'classList' => ['c-image--custom-width', 'u-margin__top--1', 'u-margin__right--2', 'u-margin__bottom--1', 'u-float--left']
            ])
            @endimage

            celery lotus root carrot winter purslane turnip greens garlic.

            Brussels sprout coriander water chestnut gourd swiss chard wakame kohlrabi beetroot carrot watercress.
            Corn amaranth salsify bunya nuts nori azuki bean chickweed potato bell pepper artichoke.

            <br /><br />
            @button([
                'href' => "#",
                'text' => "Button component",
                'toggle' => true,
                'isOutlined' => false,
                'color' => "primary",
                'attributeList' => ['tabindex' => "1"],
                'classList' => ["c-button__button"]
            ])
            @endbutton

            @button([
                'href' => "#",
                'text' => "Button component",
                'toggle' => true,
                'isOutlined' => false,
                'color' => "secondary",
                'attributeList' => ['tabindex' => "1"],
                'classList' => ["c-button__button"]
            ])
            @endbutton
            <br /><br />
            Blue castello red leicester camembert de normandie. Swiss cheeseburger taleggio cheesy feet who moved my
            cheese airedale mozzarella boursin.

            @endcard
        </div>

    </div>

    @enddoc



@stop




