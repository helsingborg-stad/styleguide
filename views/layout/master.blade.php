<!doctype html>
<html lang="sv">
<head>
    <meta charset="utf-8">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>Municipio Styleguide - V.3</title>
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
<body class="no-js o-body">

    <!-- Force this logotype to be white, as the header background is dark. -->
    <style>
        .c-header__logotype .c-logotype__image {
            background-color: var(--color-surface-contrast-muted);
            mask-image: url("/assets/img/logotype.svg");
            mask-repeat: no-repeat;
            mask-position: center;
            mask-size: contain;
            /* Safari support */
            -webkit-mask-image: url("/assets/img/logotype.svg");
            -webkit-mask-repeat: no-repeat;
            -webkit-mask-position: center;
            -webkit-mask-size: contain;
            width: 120px;   /* required */
            height: 40px;   /* required */
        }
    </style>
    
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

    <div class="l-docs">

        @header([
            'id' => 'site-header',
            'classList' => [
                'l-docs--header',
                'c-header',
                'u-display--flex',
                'u-align-items--center',
                'u-justify-content--space-between',
                'u-border__bottom--1',
                'u-padding__x--4',
                'u-padding__y--1',
            ]
        ])
            <div class="u-display--flex u-align-items--center">
                @nav([
                    'items' => [[
                        'href' => '#',
                        'label' => 'Menu',
                        'style' => 'button',
                        'buttonStyle' => 'basic',
                        'buttonColor' => 'default',
                        'icon' => ['icon' => 'menu'],
                        'classList' => ['u-margin__right--3'],
                        'attributeList' => [
                            'js-toggle-trigger' => 'js-mobile-sidebar',
                            'js-toggle-class' => 'c-sidebar--collapsed'
                        ]
                    ]],
                    'direction' => 'horizontal',
                    'allowStyle' => true,
                    'classList' => ['u-margin--0']
                ])
                @endnav
            </div>

            <div class="u-display--flex u-align-items--center u-width--100 u-margin__x--3">
                @form(['action' => '/components', 'method' => 'get', 'classList' => ['u-width--100']])
                    @field([
                        'label' => 'Search documentation',
                        'hideLabel' => true,
                        'name' => 'q',
                        'type' => 'search',
                        'placeholder' => 'Search components, utilities and scripts',
                        'classList' => ['u-margin--0'],
                        'attributeList' => ['autocomplete' => 'off'],
                        'size' => 'sm',
                        'icon' => ['icon' => 'search']
                    ])
                    @endfield
                @endform
            </div>

            <div class="u-display--flex u-align-items--center">
                @nav([
                    'items' => [
                        [
                            'href' => 'https://getmunicipio.com',
                            'label' => 'Website',
                            'style' => 'button',
                            'buttonStyle' => 'basic',
                            'buttonColor' => 'default',
                            'icon' => ['icon' => 'public'],
                            'classList' => ['u-margin__right--2'],
                            'attributeList' => [
                                'target' => '_blank',
                                'title' => 'Visit getmunicipio.com'
                            ]
                        ],
                        [
                            'href' => 'https://github.com/helsingborg-stad/styleguide',
                            'label' => 'GitHub',
                            'style' => 'button',
                            'buttonStyle' => 'basic',
                            'buttonColor' => 'default',
                            'icon' => ['icon' => 'code'],
                            'attributeList' => [
                                'target' => '_blank',
                                'title' => 'Open repository on GitHub'
                            ]
                        ]
                    ],
                    'direction' => 'horizontal',
                    'allowStyle' => true,
                    'classList' => ['u-margin--0']
                ])
                @endnav
            </div>
        @endheader


        @include('layout.partials.doc-nav', [
            'items' => $sideNavigation,
            'attributeList' => [
                'js-toggle-item' => 'js-mobile-sidebar',
                'js-toggle-class' => 'c-sidebar--collapsed'
            ]
        ])
    
        @yield('content')

        @yield('bottom_hero')

        @include('layout.footer')
    </div>

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
