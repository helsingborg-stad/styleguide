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

    @if(isset($customizeAssets['style']) && !empty($customizeAssets['style']))
        <link rel="stylesheet" href="{{ $customizeAssets['style'] }}" type="text/css" media="all">
    @endif

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,300;0,400;0,500;0,700;0,900;1,400;1,500&display=swap" rel="stylesheet">
    <style>
        {!! "@import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined') layer(components);" !!}
    </style>

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
        .c-header__logotype  {
            background-color: var(--color--surface-contrast);
            mask-image: url("/assets/img/logotype.svg");
            mask-repeat: no-repeat;
            mask-position: center;
            mask-size: contain;
            transition: background-color 0.3s ease;
        }

        .c-header__logotype:hover {
            background-color: var(--color--surface-contrast-muted);
        }
        .c-header__logotype img {
            visibility: hidden;
        }
    </style>
    
    <div class="l-docs">

        @php
            $topNavigationItems = [
                [
                    'href' => '/design-builder',
                    'label' => 'Design Lab',
                    'style' => 'button',
                    'buttonStyle' => 'basic',
                    'buttonColor' => 'default',
                    'icon' => ['icon' => 'format_paint'],
                    'classList' => ['u-margin__right--2'],
                    'attributeList' => [
                        'title' => 'Design Lab'
                    ]
                ],
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
            ];
        @endphp

        @header([
            'id' => 'site-header',
            'classList' => [
                'l-docs-desktop-header',
                'l-docs--header',
                'c-header',
                'u-display--flex',
                'u-align-items--center',
                'u-justify-content--space-between',
                'u-border__bottom--1',
                'u-padding__x--6',
                'u-padding__y--1',
                'u-gap--4'
            ]
        ])
            <div class="u-display--flex u-align-items--center u-width--100">
                @form(['action' => '/', 'method' => 'get', 'classList' => ['u-width--100']])
                    @field([
                        'label' => 'Search documentation',
                        'hideLabel' => true,
                        'name' => 's',
                        'type' => 'search',
                        'placeholder' => 'Search components, utilities and scripts',
                        'classList' => ['u-margin--0'],
                        'attributeList' => [
                            'data-datalist' => '/search',
                            'data-datalist-query-param' => 'q'
                        ],
                        'autocomplete' => 'off',
                        'size' => 'sm',
                        'icon' => ['icon' => 'search']
                    ])
                    @endfield
                @endform
            </div>

            <div class="u-display--flex u-align-items--center">
                @nav([
                    'items' => $topNavigationItems,
                    'direction' => 'horizontal',
                    'allowStyle' => true,
                    'classList' => ['u-margin--0']
                ])
                @endnav
            </div>
        @endheader

        @header([
            'id' => 'mobile-site-header',
            'classList' => [
                'l-docs-mobile-header',
                'c-header',
                'u-align-items--center',
                'u-justify-content--space-between',
                'u-border__bottom--1',
                'u-padding__x--3',
                'u-padding__y--1'
            ]
        ])
            @link(['id' => 'main-logo-link', 'href' => '/', 'classList' => ['u-display-block']])
                @logotype([
                    'id' => 'main-logo',
                    'src' => '/assets/img/logotype.svg',
                    'alt' => 'Go to homepage',
                    'classList' => ['c-header__logotype']
                ])
                @endlogotype
            @endlink

            @drawer([
                'label' => 'Close',
                'attributeList' => [
                    'data-move-to' => 'body'
                ],
                'toggleButtonData' => [
                    'text' => 'Menu',
                    'icon' => 'menu',
                    'style' => 'basic',
                    'color' => 'default',
                    'size' => 'md'
                ]
            ])
                @slot('search')
                    @form(['action' => '/', 'method' => 'get', 'classList' => ['u-width--100']])
                        @field([
                            'label' => 'Search documentation',
                            'hideLabel' => true,
                            'name' => 's',
                            'type' => 'search',
                            'placeholder' => 'Search components, utilities and scripts',
                            'classList' => ['u-margin--0'],
                            'attributeList' => [
                                'autocomplete' => 'off',
                                'data-datalist' => '/search',
                                'data-datalist-query-param' => 'q'
                            ],
                            'size' => 'sm',
                            'icon' => ['icon' => 'search']
                        ])
                        @endfield
                    @endform
                @endslot

                @slot('menu')
                    @nav([
                        'items' => $sideNavigation,
                        'direction' => 'vertical',
                        'classList' => ['u-display--block', 'site-nav-mobile__primary'],
                        'includeToggle' => true,
                        'indentSubLevels' => true,
                    ])
                    @endnav

                    @nav([
                        'items' => $topNavigationItems,
                        'direction' => 'vertical',
                        'allowStyle' => false,
                        'classList' => ['u-margin__top--2', 'site-nav-mobile__secondary']
                    ])
                    @endnav
                @endslot
            @enddrawer
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

    <style>
        .l-docs-mobile-header {
            display: none;
        }

        @media (max-width: 56em) {
            .l-docs-desktop-header,
            .l-docs--sidebar {
                display: none !important;
            }

            .l-docs-mobile-header {
                display: flex !important;
            }
        }
    </style>

    @php
        $currentPath = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
        $themePresetDefinitions = [
            ['id' => 'dark', 'label' => 'Dark Ember', 'path' => 'source/themes/dark.json'],
            ['id' => 'nordic-dawn', 'label' => 'Nordic Dawn', 'path' => 'source/themes/nordic-dawn.json'],
            ['id' => 'forest-mist', 'label' => 'Forest Mist', 'path' => 'source/themes/forest-mist.json'],
            ['id' => 'sunset-clay', 'label' => 'Sunset Clay', 'path' => 'source/themes/sunset-clay.json'],
            ['id' => 'ocean-ink', 'label' => 'Ocean Ink', 'path' => 'source/themes/ocean-ink.json'],
            ['id' => 'aurora-light', 'label' => 'Aurora Light', 'path' => 'source/themes/aurora-light.json'],
            ['id' => 'high-contrast', 'label' => 'High Contrast A11y', 'path' => 'source/themes/high-contrast.json'],
        ];
        $designBuilderPresets = [];
        foreach ($themePresetDefinitions as $themePresetDefinition) {
            $tokenOverrides = json_decode(file_get_contents(BASEPATH . $themePresetDefinition['path']), true);
            if (!is_array($tokenOverrides)) {
                continue;
            }

            $designBuilderPresets[] = [
                'id' => $themePresetDefinition['id'],
                'label' => $themePresetDefinition['label'],
                'token' => $tokenOverrides,
            ];
        }
    @endphp
    @if(
        $currentPath !== '/design-builder' &&
        isset($customizeAssets['data']) &&
        !empty($customizeAssets['data']) &&
        isset($customizeAssets['tokenLibrary']) &&
        !empty($customizeAssets['tokenLibrary'])
    )
        @fab([
            'position' => 'bottom-right',
            'button' => [
                'icon' => 'tune',
                'size' => 'md',
                'color' => 'primary',
                'shape' => 'pill',
                'classList' => ['u-margin--0'],
                'ariaLabel' => 'Open component customizer'
            ],
            'classList' => ['c-fab--width-xl', 'c-fab--padding-none'],
            'attributeList' => [
                'data-customizable' => 'false'
            ]
        ])
            @php
                $customizeComponentData = json_decode($customizeAssets['data'] ?? 'null', true);
                $customizeTokenLibrary = json_decode($customizeAssets['tokenLibrary'] ?? 'null', true);
            @endphp
            <design-builder
                component-data='@json($customizeComponentData)'
                token-library='@json($customizeTokenLibrary)'
                presets='@json($designBuilderPresets)'
                class="design-builder"
                data-customizable="false"
            ></design-builder>
        @endfab
    @endif

    <!-- Styleguide - js -->
    @if($assets['scripts'])
        @foreach($assets['scripts'] as $script)
            <script src="/assets/dist/{{ $script }}" type="module"></script>
        @endforeach
    @else 
        <!-- No js found in manifest: Please build -->
    @endif

    @if(isset($customizeAssets['script']) && !empty($customizeAssets['script']))
        <script src="{{ $customizeAssets['script'] }}" type="module"></script>
    @endif

    <!-- Highlight js -->
    <script src="/assets/prism/prism.js" defer="defer"></script>

</body>
</html>
