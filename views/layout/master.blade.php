<!doctype html>
<html lang="sv">
<head>
    <meta charset="utf-8">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>Helsingborg Style Guide</title>
    <meta name="description" content="">
    <link rel="stylesheet" type="text/css" href="/assets/dist/css/styleguide-css.min.css">
    <link rel="stylesheet" type="text/css" href="https://highlightjs.org/static/demo/styles/github-gist.css">


    @if(!isset($_GET['v2']))
    <link rel='stylesheet' id='hbg-prime-css'  href='//helsingborg-stad.github.io/styleguide-web/dist/css/hbg-prime-red.min.css' type='text/css' media='all' />
    @endif

    <style>
        .current-page {
            background: #eee;
        }
        .current-page .sub-menu {
            display: block;
        }

        .markup-preview {
            border:none;
            background: transparent;
            padding:0px;
            margin-bottom:32px;
            box-shadow: none;
        }
    </style>

    <noscript>
        <style>
            .visible-noscript {display: block !important;}
        </style>
    </noscript>

</head>
<body class="no-js">
    <nav class="navbar">
        <div class="container">
            <div class="grid">
                <div class="grid-md-3">
                    <a href="/"><img id="logotype" src="/assets/img/logotype.svg" alt="Helsingborg Stad" height="35" style="margin: 20px 0 12px 0"></a>
                </div>
                <div class="grid-md-3">
                    @button(['href'=>'?v2', 'isPrimary' => false])
                            Preview
                    @endbutton
                </div>
            </div>
        </div>
    </nav>

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

    <div class="container" style="margin: 70px auto">
        <div class="grid">
            <div class="grid-md-3">
                @include('layout.navigation')
            </div>
            <div class="grid-md-9">
                <section>
                    <article>
                        @yield('content')
                    </article>
                </section>
            </div>
        </div>
    </div>

    <footer class="main-footer">
        <div class="container">
            <div class="grid">
                <div class="grid-lg-12">
                    <a href="/" class="logotype"><img src="/assets/img/logotype.svg" alt="Helsingborg Stad" width="239" height="68"></a>
                </div>
            </div>
            <div class="grid">
                <div class="grid-lg-6">
                    
                </div>
                <div class="grid-lg-6">
             
                </div>
            </div>
        </div>
    </footer>

    <!-- jQuery --> 
    <script
    src="https://code.jquery.com/jquery-3.3.1.slim.min.js"
    integrity="sha256-3edrmyuQ0w65f8gfBsqowzjJe2iM6n0nKciPUp8y+7E="
    crossorigin="anonymous"></script>

    <!-- Styleguide - js -->
    <script src="/assets/dist/js/styleguide-js.min.js"></script>

    <!-- Highlight js -->
    <script src="//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.0.0/highlight.min.js"></script>

    <!-- Run highlight --> 
    <script>
        $(function(){
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
        });
    </script>

    <!-- Anime JS -->
    <script src="https://cdn.jsdelivr.net/npm/animejs@3.0.1/lib/anime.min.js"></script>

    <script>

        anime({
            targets: '.navbar',
            opacity: [0,1],
            easing: 'spring(1, 80, 10, 0)'
        });

        anime({
            targets: '.c-card',
            opacity: [0,1],
            translateY: ['20px','0px'],
            delay: anime.stagger(140),
            easing: 'spring(1, 80, 10, 0)'
        });

        anime({
            targets: '.gallery li',
            opacity: [0,1],
            translateY: ['50px','0px'],
            delay: anime.stagger(140),
            easing: 'spring(1, 80, 10, 0)'
        });

    </script>

    <script>

        const codeElements = document.querySelectorAll('table tr,  nav ul li a, nav ul li ul li a');

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
    </script>


</body>
</html>
