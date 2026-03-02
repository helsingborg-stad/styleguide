@extends('layout.master')

@section('content')
    <div class="container--doc l-docs--content">
            @hasSection('doc-hero')
                @yield('doc-hero')
            @else
                @include('layout.partials.doc-hero', [
                    'title' => 'Helsingborg Styleguide',
                    'subtitle' => 'Find components, utilities and guidance quickly with a documentation-first layout.',
                    'primaryCta' => ['label' => 'Explore components', 'href' => '/components'],
                    'secondaryCta' => ['label' => 'Read setup guide', 'href' => '/setup'],
                    'shortcuts' => [
                        ['label' => 'Getting started', 'href' => '/setup'],
                        ['label' => 'Design builder', 'href' => '/design-builder'],
                        ['label' => 'Browser support', 'href' => '/about/browser-support'],
                        ['label' => 'Utilities', 'href' => '/utilities'],
                    ],
                ])
            @endif

            <div class="o-grid o-grid--large u-margin__top--2">
                <div class="o-grid-12 o-grid-9@xl">
                    <article class="article">
                        @yield('home-content')
                    </article>
                </div>
                <div class="o-grid-12 o-grid-3@xl">
                    @include('layout.partials.doc-aside', ['pageNow' => $pageNow ?? null])
                </div>
            </div>
    </div>
@stop
