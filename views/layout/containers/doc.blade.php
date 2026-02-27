@extends('layout.master')

@section('content')
    <div class="container--doc l-docs--content">
        <div class="o-container u-padding__y--6">
            @hasSection('doc-hero')
                @yield('doc-hero')
            @else
                @include('layout.partials.doc-hero', [
                    'title' => 'Documentation',
                    'subtitle' => 'Explore the component library, utilities, scripts and examples in a focused docs layout.',
                    'shortcuts' => [
                        ['label' => 'Components', 'href' => '/components'],
                        ['label' => 'Utilities', 'href' => '/utilities'],
                        ['label' => 'Scripts', 'href' => '/script'],
                        ['label' => 'Setup', 'href' => '/setup'],
                    ],
                ])
            @endif

            <div class="o-grid o-grid--large u-margin__top--2">
                <div class="o-grid-12 o-grid-9@xl">
                    @paper(['padding' => 5, 'classList' => ['u-margin__bottom--5']])
                        <article class="article">
                            @yield('doc-content')
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