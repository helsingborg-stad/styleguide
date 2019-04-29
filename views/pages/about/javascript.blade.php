@extends('layout.master')

@section('content')
<article>

    @markdown
        #Javascript
        The styleguide contains a simplistic javascript framework for simple tasks like toggling classes, filtering list and applying usability tweaks. 

        All javascript functions is decpoupled from components (javascript function has no target component). They should be written in a disconnected way from the component scope. 

        Javascript functions can be utilized from the components with inline attributes. Every parameter that is utilized by javascript should be prefixed with the key "js-". 

    @endmarkdown

    @code(['language' => 'html', 'escape' => true, 'preTagElement' => 'pre', 'content' => ""]) 
        <a href="#"                                         //No default action
            js-bind="click"                                     //On what event the javascript should trigger
            js-action="toggleClass"                             //The script to run
            js-toggle-target="component__heading-1"             //The target element to affect
            js-toggle-class="component__heading--is-active"     //What class to toggle
        >
        Im a toggle link!
        </a>
    @endcode

    @markdown
        ##Toggling classes
        Toggle a class on the specified target element. 
    @endmarkdown

    @table([
        'list' => [
            ['js-bind', 'Event to bind on', 'keyup'],
            ['js-action', 'Should always contain "toggleClass" for css toggling of classes.', 'toggleClass'],
            ['js-toggle-target', 'Target element to toggle the class on, should be a class.', '.somediv'],
            ['js-toggle-class', 'The class to toggle on the target element.', '.is-active']
        ],
        'headings' => ['Attribute', 'Description', 'Example value'],
        'showFooter' => false,
        'isSmall' => false
    ])
    @endtable

    @markdown
        ##TODO: Ordering lists
        Ordet a list (or divs) by data attributes. 
    @endmarkdown

    @table([
        'list' => [
            ['js-bind', 'Event to bind on', 'keyup'],
            ['js-action', 'Should always contain "toggleClass" for css toggling of classes.', 'toggleClass'],
            ['js-toggle-target', 'Target element to toggle the class on, should be a class.', '.somediv'],
            ['js-toggle-class', 'The class to toggle on the target element.', '.is-active']
        ],
        'headings' => ['Attribute', 'Description', 'Example value'],
        'showFooter' => false,
        'isSmall' => false
    ])
    @endtable

    @markdown
        ##TODO: Filtering lists (search)
        Hide elements based on match with data attributes.
    @endmarkdown

    @table([
        'list' => [
            ['js-bind', 'Event to bind on', 'keyup'],
            ['js-action', 'Should always contain "toggleClass" for css toggling of classes.', 'toggleClass'],
            ['js-toggle-target', 'Target element to toggle the class on, should be a class.', '.somediv'],
            ['js-toggle-class', 'The class to toggle on the target element.', '.is-active']
        ],
        'headings' => ['Attribute', 'Description', 'Example value'],
        'showFooter' => false,
        'isSmall' => false
    ])
    @endtable

    @markdown
        ##TODO: Animations
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
        
    @endmarkdown

    @table([
        'list' => [
            ['js-bind', 'Event to bind on (onload = init animation, scroll = in view animation)', 'scroll/onload'],
            ['js-action', 'Animate keyword for animations.', 'animate'],
            ['js-animate-target', 'A sub element of the bound target, if left blank bound target will be animated.', 'li.list-element'],
            ['js-animate-type', 'Type of animation', 'fade/fadeUp/fadeLeft/bounce'],
            ['js-animate-stagger', 'Stagger (delay) each item in list of items (ms).', '300'],
            ['js-animate-time', 'Time to complete animation.', '50']
        ],
        'headings' => ['Attribute', 'Description', 'Example value(s)'],
        'showFooter' => false,
        'isSmall' => false
    ])
    @endtable

</article>
@stop
