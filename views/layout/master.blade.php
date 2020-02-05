<!doctype html>
<html lang="sv">
<head>
    <meta charset="utf-8">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>Helsingborg Styleguide - Version 2.0</title>
    <meta name="description" content="">
    <!-- <link rel="stylesheet" type="text/css" href="https://highlightjs.org/static/demo/styles/github-gist.css"> -->
    <link href="/assets/prism/prism.css" rel="stylesheet" />
    <link rel="stylesheet" id="styleguide-css" type="text/css" href="/assets/dist/css/styleguide-css.min.css" type='text/css' media='all'>
    <script type='text/javascript' defer="defer" src='https://polyfill.io/v3/polyfill.js?features=es5,es6,es7&flags=gated'></script>

    <link rel='dns-prefetch' href='//cdn.polyfill.io' />
    <!-- <link rel='dns-prefetch' href='//highlightjs.org' /> -->

    <noscript>
        <style>
            .visible-noscript {display: block !important;}
        </style>
    </noscript>

    <style>

        .example {
            margin-top: 32px;
        }

    </style>

</head>
<body class="no-js">

{{-- 
    @header()
        @slot('logotype')
            @logotype([
                'id' => 'logotype',
                'src'=> '/assets/img/logotype.svg',
                'alt' => "Helsingborg Stad Logotype",
                'classList' => array("c-tooltip", "c-tooltip__bottom"),
                'attributeList' => array('data-title' => 'Go to home')
            ])
            @endlogotype
        @endslot
        
        @slot('menu')
            @menu([
                'items' => $topNavigation,
                'isHorizontal' => true
            ])
            @endmenu
        @endslot
    @endheader --}}
    @navbar([
        'logo' => '/assets/img/logotype.svg',
        'logoPosition' => 'left',
        'linksPosition' => 'right',
        'topAccent' => 'primary',
        'activeAccent' => 'primary',
        'items' => $topNavigation,
        'sidebar' => true
    ])

    @endnavbar

    @yield('hero')

    @if(!$componentLibraryIsInstalled && $isLocalDomain) 
    <div class="container">
        <div class="grid">
            <div class="grid-xs-12">
                <div class="notice warning">
                    <i class="pricon pricon-notice-warning"></i> The blade component library is not installed, please run "composer install" in the root directory to complete the installation process and start developing. 
                </div>
            </div>
        </div>
    </div>
    @endif

    @include('layout.navigation')
    
    <div class="container container--main">
        @notice(['type' => 'info', 'classList'=>['u-margin__bottom--2']]) 
            <strong>Beta version: </strong> This styleguide is still in beta. It's not recommended to use on a production website.
        @endnotice
        <section>
            <article class="article">
                @yield('content')
            </article>
        </section>
    </div>

    @footer()

        @slot('logotype')
            <img id="logotype" src="/assets/img/logotype.svg" alt="Helsingborg Stad">
        @endslot
        
        @slot('menu')
            @menu([
                'id' => 'footer-menu', 
                'items' => $topNavigation,
                'isHorizontal' => true
            ])
            @endmenu
        @endslot

    @endfooter

    <!-- jQuery --> 
    <script
    src="https://code.jquery.com/jquery-3.3.1.slim.min.js"
    integrity="sha256-3edrmyuQ0w65f8gfBsqowzjJe2iM6n0nKciPUp8y+7E="
    crossorigin="anonymous"></script>

    <!-- Styleguide - js -->
    <script src="/assets/dist/js/styleguide-js.min.js"></script>

    <!-- Highlight js -->
    <!-- <script src="//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.0.0/highlight.min.js"></script> -->
    <script src="/assets/prism/prism.js"></script>

    <!-- Run highlight --> 
    <script>
        
        /**$(function(){
            $('pre code').each(function(){
                var lines = $(this).text().split('\n').length - 1;
                var $numbering = $('<ul/>').addClass('line-numbers');
                $(this)
                    .addClass('has-numbering')
                    .parent()
                    .prepend($numbering);
                for (i = 1; i <= lines + 1; i++){
                    $numbering.append($('<li/>').text(i));
                }
            });
            hljs.initHighlightingOnLoad();
        }); **/
    </script>

    <!-- Anime JS -->
    <script src="https://cdn.jsdelivr.net/npm/animejs@3.0.1/lib/anime.min.js"></script>

    <script>

        anime({
            targets: '.navbar',
            opacity: [0,1],
            easing: 'spring(1, 80, 10, 0)'
        });

        /*
         anime({
            targets: '.c-modal',
            opacity: [0,1],
            translateY: ['20px','0px'],
            delay: anime.stagger(140),
            easing: 'spring(1, 80, 10, 0)'
         });

       anime({
            targets: '.c-card',
            opacity: [0,1],
            translateY: ['20px','0px'],
            delay: anime.stagger(140),
            easing: 'spring(1, 80, 10, 0)'
        });
         */

        anime({
            targets: '.gallery li',
            opacity: [0,1],
            translateY: ['50px','0px'],
            delay: anime.stagger(140),
            easing: 'spring(1, 80, 10, 0)'
        });

        anime({
            targets: '.c-hero__content > *',
            opacity: [0,1],
            translateX: ['10px','0px'],
            delay: anime.stagger(50),
            easing: 'spring(1, 80, 10, 0)'
        });

    </script>

    <script>
/*
        const codeElements = document.querySelectorAll('table tr');

        const observerConfig = {
            threshold: 0.2
        };

        observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.intersectionRatio > observerConfig.threshold) {
                    anime({
                        targets: entry.target,
                        opacity: [0,1],
                        translateX: ['20px','0px'],
                        easing: 'spring(1, 80, 10, 0)'
                    });
                } else {
                    anime({
                        targets: entry.target,
                        opacity: [1,0],
                        translateX: ['0','20px'],
                        easing: 'spring(1, 80, 10, 0)'
                    });
                }
            });
        }, observerConfig);

        codeElements.forEach(codeElement => {
            observer.observe(codeElement);
        });

        */ 
    </script>


</body>
</html>
