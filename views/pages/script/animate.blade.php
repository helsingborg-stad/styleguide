@extends('layout.master')

@section('content')
    @markdown
        #TODO: Animations
        Animate elements, or sub elements to a container. You can choose from multiple predefined effects, defined by the styleguide. All animations in done with anime-js. 

        ###Effects
        - fade
        - fadeUp (Left, Right, Down)
        - bounce

        ###Bind 
        Two types of bind can be done, they are the following: 

        - Scroll: Will animate in and out near the edges of the viewport (compatible with modern browsers)
        - Onload: Will animate on load of the page. 

        ###Other
        All animations will be triggerd automatically when toggling display: none, display: block. 

        ###Library
        We have chosen anime.js to create advanced animations swiftly. Like all javascript animation librarys it's always as performant that you would want. Therefore this library should be utilized where css-animations can't create the same effect. 

    @endmarkdown

    @paper
        @table([
            'list' => [
                ['js-bind', 'Event to bind on (onload = init animation, scroll = in view animation)', 'scroll/onload'],
                ['js-action', 'Animate keyword for animations.', 'animate'],
                ['js-animate-target', 'A sub element of the bound target, if left blank bound target will be animated. The target element is automatically prefixed by the dom-node of the bound element.', 'li.list-element'],
                ['js-animate-type', 'Type of animation', 'fade/fadeUp/fadeLeft/bounce'],
                ['js-animate-stagger', 'Stagger (delay) each item in list of items (ms). Use 0 or false to turn off staggering.', '300'],
                ['js-animate-time', 'Time to complete animation.', '50']
            ],
            'headings' => ['Attribute', 'Description', 'Example value(s)'],
            'showFooter' => false,
            'isSmall' => false
        ])
        @endtable
    @endpaper
@stop
