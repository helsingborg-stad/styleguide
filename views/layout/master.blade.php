<!doctype html>
<html lang="sv">
<head>
    <meta charset="utf-8">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>Helsingborg Styleguide - Version 2.0</title>
    <meta name="description" content="">

    <link href="/assets/prism/prism.css" rel="stylesheet" />

    <!-- Styleguide - css -->
    @if($assets['styles'])
        @foreach($assets['styles'] as $style)
            <link rel="stylesheet" href="/assets/dist/{{ $style }}" type="text/css" media="all">
        @endforeach
    @else 
        <!-- No css found in manifest: Please build -->
    @endif

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,300;0,400;0,500;0,700;0,900;1,400;1,500&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />

    <noscript>
        <style>
            .visible-noscript {display: block !important;}
        </style>
    </noscript>

    <style>

        .example {
            margin-top: var(--base);
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
        'sidebar'   => ['trigger' => "js-mobile-sidebar"],
        'classList' => ['c-navbar--border-top']
    ])
    @endnavbar

    @if($isLocalDomain) 
        <div class="container">
            <div class="o-grid">
                <div class="o-grid-12">
                    <div class="notice warning">
                        <i class="pricon pricon-notice-warning"></i> The blade component library is not installed, please run "composer install" in the root directory to complete the installation process and start developing. 
                    </div>
                </div>
            </div>
        </div>
    @endif
    
    @yield('content')

    @yield('bottom_hero')

    <!-- Styleguide - js -->
    @if($assets['scripts'])
        @foreach($assets['scripts'] as $script)
            <script src="/assets/dist/{{ $script }}" type="module"></script>
        @endforeach
    @else 
        <!-- No js found in manifest: Please build -->
    @endif

    <!-- Highlight js -->
    <script src="/assets/prism/prism.js" defer="defer"></script>

</body>
</html>
