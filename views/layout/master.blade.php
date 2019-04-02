<!doctype html>
<html lang="sv">
<head>
    <meta charset="utf-8">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>Helsingborg Style Guide</title>
    <meta name="description" content="">

    <link rel="stylesheet" type="text/css" href="https://highlightjs.org/static/demo/styles/github-gist.css">
    <link rel="stylesheet" type="text/css" href="/dist/css/hbg-prime-red.dev.css">
    <link rel='stylesheet' id='hbg-prime-css'  href='//helsingborg-stad.github.io/styleguide-web/dist/css/hbg-prime-red.min.css' type='text/css' media='all' />

    <style>
        .current-page {
            background: #eee;
        }
        .current-page .sub-menu {
            display: block;
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
                    <a href="/"><img id="logotype" src="/assets/img/logotype.svg" alt="Helsingborg Stad" height="35"></a>
                </div>
                
            </div>
        </div>
    </nav>

    <div class="container">
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
                    <a href="/" class="logotype"><img src="/logotype.svg" alt="Helsingborg Stad" width="239" height="68"></a>
                </div>
            </div>
            <div class="grid">
                <div class="grid-lg-6">
                    <ul>
                        <li><strong>Telefonnummer</strong></li>
                        <li>Helsingborg kontaktcenter: 042-10 50 00</li>
                    </ul>
                    <ul>
                        <li><strong>E-post</strong></li>
                        <li><a href="mailto:kontaktcenter@helsingborg.se" class="link-item link-item-light">kontaktcenter@helsingborg.se</a></li>
                    </ul>
                </div>
                <div class="grid-lg-6">
                    <ul>
                        <li><strong>Postadress</strong></li>
                        <li>Namn på verksamheten<br>251 89 Helsingborg</li>
                    </ul>
                </div>
            </div>
        </div>
    </footer>

    <script src="https://code.jquery.com/jquery-2.1.4.dev.js"></script>
    <script src="//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.0.0/highlight.min.js"></script>
    <script src="/dist/js/hbg-prime.dev.js"></script>

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
</body>
</html>
