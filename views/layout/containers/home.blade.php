@extends('layout.master')

@section('content')
    <div class="container--home">
        @yield('hero')

        @sidebar([
            'logo' => '/assets/img/logotype-grey-full.svg',
            'items' => $sideNavigation,
            'classList' => ['l-docs--sidebar', 'c-sidebar--fixed', 'u-display--none@md', 'u-display--none@lg', 'u-display--none@xl'],
            'attributeList' => [
                'js-toggle-item'    => 'js-mobile-sidebar',
                'js-toggle-class'   => 'c-sidebar--collapsed'
            ],
        ])

        @endsidebar
        
        <section>
            <article class="article">
                @yield('home-content')
            </article>
        </section>
        
        @include('layout.footer')
    </div>
@stop