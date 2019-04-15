@extends('layout.master')

@section('content')
<article>

    {!! markdown("

        # Accessibility
        **We have followed the [Web Content Accessibility Guidelines (WCAG 2.1)](https://www.w3.org/TR/WCAG21/) when designing this styelguide. Below is a summary of the rules that we have applied.**

        ## Validated HTML, CSS and JS
        All code is validated by a linter in the build process before deployed to production.

        ## Use built in HTML elements
        Primarly use the built in HTML elements before creating custom components.
        ### Don't
        ```html
        <span class=\"heading-1\">Lorem ipsum</span>
        ```

        ### Do
        ```html
        <h1>Lorem ipsum</h1>
        ```

        ## Use HTML-elements correctly
        Increase the chance that the information is presented correctly regardless of the users equipment, by using the HTML elements correctly.

        *Example:*
        Use list-related HTML elements (ol, ul, li) for list items only.
        ### Don't
        ```html
        <nav>
            <ul>
                <li><a href=\"#\">Home</a></li>
                <li><a href=\"#\">About</a></li>
                <li><a href=\"#\">Clients</a></li>
                <li><a href=\"#\">Contact Us</a></li>
            </ul>
        </nav>
        ```

        ### Do
        ```html
        <h1>Fruits</h1>
        <ul>
            <li>Apple</li>
            <li>Banana</li>
            <li>Orange</li>
            <li>Pineapple</li>
        </ul>
        ```

        ## Flexible layout
        Use a flexible layout that works regardless if zooming or viewing from different screen sizes.

        ## Use more than color to distinguish information
        Don't let color differences be the only way to distinguish information, but supplement with, for example, text, patterns or any other visual indication.

        *Example:*
        Complement colored notices with icons.

        ### Don't

        <div class=\"notice warning\">
            Tiramisu pastry candy gummi bears.
        </div>
        <div class=\"notice info\">
            Sugar plum gummi bears.
        </div>

        ### Do

        <div class=\"notice warning\">
            <i class=\"pricon pricon-notice-warning\"></i> Tiramisu pastry candy gummi bears.
        </div>
        <div class=\"notice info\">
            <i class=\"pricon pricon-info-o\"></i> Sugar plum gummi bears.
        </div>

        ## Popup functions should easy to handle and close
        Popup fucntions such as modals must be able to be handled and closed by everyone. The content should be easy to close again so that it does not interfere with or block the original content of the page. If possible implement close functionality through the keyboard command Escape, a close button and a new click either outside the content area or on the same position that opened the content.

        ## Accessible color contrasts
        Give interface components clear visual boundaries between different color contrasts.
        The same goes for when using text ontop of image backgrounds.
        There are multiple online services for measuring contrast accessibility, [for example Material.io Color Tool](https://material.io/tools/color).

        ## Font size enlargement
        It must be possible to increase the font size to at least double height and width without any problems.

        ## Element focusing
        Clearly show which field or element that is in focus.

        ## Keyboard navigation
        Possibility to navigate on a keyboard with tabs through the page and its components.

    ") !!}

</article>
@stop
