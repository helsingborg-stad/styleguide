<!doctype html>
<html lang="sv">
<head>
    <meta charset="utf-8">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>Helsingborg Styleguide - Version 2.0</title>
    <meta name="description" content="">

    <link href="/assets/prism/prism.css" rel="stylesheet" />
    <link rel="stylesheet" id="styleguide-css" type="text/css" href="/assets/dist/css/styleguide-css.min.css" type='text/css' media='all'>
    
    <script type='text/javascript' defer="defer" src='https://polyfill.io/v3/polyfill.js?features=es5,es6,es7&flags=gated'></script>

    <link rel='dns-prefetch' href='//cdn.polyfill.io' />

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
    
    @yield('content')

    @yield('bottom_hero')

    <!-- jQuery --> 
    <script
    src="https://code.jquery.com/jquery-3.3.1.slim.min.js"
    integrity="sha256-3edrmyuQ0w65f8gfBsqowzjJe2iM6n0nKciPUp8y+7E="
    crossorigin="anonymous"></script>

    <!-- Styleguide - js -->
    <script src="/assets/dist/js/styleguide-js.min.js"></script>

    <!-- Highlight js -->
    <script src="/assets/prism/prism.js"></script>

</body>
</html>
