@extends('layout.master')

@section('content')
    <div class="l-docs">

        @header([
        'id' => 'site-header',
        'classList' => [
            'l-docs--header',
            'c-header', 
            'u-display--flex', 
            'u-align-items--center', 
            'u-border__bottom--1',
        ]
    ])
        @link(['id' => 'header-logotype', 'href' => '/', 'classList' => ['u-margin__right--auto', 'u-display--flex', 'u-no-decoration']])
            @logotype([
                'src'=> "/assets/img/logotype.svg",
                'alt' => "Go to homepage",
                'classList' => ['c-nav__logo', 'c-header__logotype'],
                'context' => ['site.header.logo', 'site.header.casual.logo']
            ])
            @endlogotype
        @endlink

        @nav([
            'items' => $topNavigation,
            'classList' => ['u-margin__left--auto', 'u-margin__right--4'],
            'direction' => 'horizontal',
            'attributeList' => ['style' => 'width: auto;']
        ])
        @endnav
    @endheader



        @sidebar([
            'items' => $sideNavigation,
            'classList' => ['l-docs--sidebar', 'c-sidebar--fixed'],
            'attributeList' => [
                'js-toggle-item'    => 'js-mobile-sidebar',
                'js-toggle-class'   => 'c-sidebar--collapsed'
            ],
        ])

        @endsidebar

        <div class="container--doc l-docs--content">
            <section>
                <article class="article">
                    @yield('doc-content')
                </article>
            </section>
        </div>

        @include('layout.footer')
    </div>
@stop