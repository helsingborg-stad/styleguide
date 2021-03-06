@extends('layout.master')

@section('content')
<div class="l-docs">
    @sidebar([
        'logo' => '/assets/img/logotype-grey-full.svg',
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
        
        @include('layout.footer')
    </div>
</div>
@stop