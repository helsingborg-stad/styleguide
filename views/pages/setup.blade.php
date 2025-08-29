@extends('layout.containers.doc')
<script src="node_modules/clientside-require/dist/bundle.js"></script>

@section('doc-content')

    @markdown
        #Setup
        Getting started with an easy, minimal setup, load the precompiled all-in-one CSS and JS or compile your own component setup.
    @endmarkdown


    @paper(['padding' => 3])
    <article>

        @markdown
            ##Quick start
            Looking for a quick setup to add our Styleguide to your project? <br><br>
            You just have to make sure you link the files properly in your web page. <br>
            Generally it is wise to import Stylesheet into the head and import javascript files at the end of the body to
            reduce page load time.
            Follow the example below on how to import the styleguide files into your web page/project.

            ##CSS - The look and feel
            Copy-paste the stylesheet &lt;link&gt; into your &lt;head&gt; before all other stylesheets to load our CSS.
            @endmarkdown
            @code([
            'classList' => ['breaklines'],
            'language' => 'html',
            'content' => ''
            ])
            &lt;link rel="stylesheet" id="styleguide-css" type="text/css"
            href="https://<?php echo $_SERVER['HTTP_HOST']; ?>/assets/dist/css/styleguide-css.min.css"
            type="text/css" media="all"&gt;
        @endcode

        @markdown
            ##JavaScript - Functionality
            Many of our components require the use of JavaScript to function.
            Our JavaScript is pure vanilla JS, so no need for external plugins or libraries.
            Place the following &lt;script&gt; near the end of your pages, right before the closing &lt;/body&gt; tag.
        @endmarkdown

        @code([
            'classList' => ['breaklines'],
            'language' => 'html',
            'content' => ''])
            &lt;script id="styleguide-js" type="text/javaScript"
            href="https://<?php echo $_SERVER['HTTP_HOST']; ?>/assets/dist/js/styleguide-js.min.js"
            crossorigin="anonymous"&gt;&lt;script&gt;
        @endcode


        @markdown
            ##Great! The easy and minimal setup is done!!!!
            Now you just need to use the Component HTML that you find on the <a href="https://styleguide.local/component">component
                pages</a> or even better,
            use our <a href="https://github.com/helsingborg-stad/blade-component-library">Component Library (Open source on
                GITHUB)</a> and our blade components to render HTML. Less markup programming, so you can
            put more effort into doing other Cool things or just chill and have a nice cup of tea. More fun ;-).
        @endmarkdown

        @link([
            'href' => '/component'
        ])
            Check out the component library with Markup (HTML) / Blade examples.
        @endbutton

    </article>
    @endpaper


@stop