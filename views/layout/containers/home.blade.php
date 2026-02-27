@extends('layout.master')

@section('content')
    <div class="l-docs--content">
        <div class="o-container u-padding__y--6">
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
                    @paper(['padding' => 5, 'classList' => ['u-margin__bottom--5']])
                        <article class="article">
                            @yield('home-content')
                        </article>
                    @endpaper
                </div>
                <div class="o-grid-12 o-grid-3@xl">
                    @include('layout.partials.doc-aside', ['pageNow' => $pageNow ?? null])
                </div>
            </div>
        </div>
    </div>
@stop
