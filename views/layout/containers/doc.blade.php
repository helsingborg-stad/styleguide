@extends('layout.master')

@section('content')
    <div class="container--doc l-docs--content">
            @hasSection('doc-hero')
                @yield('doc-hero')
            @endif

            <div class="o-grid o-grid--large u-margin__top--2">
                <div class="o-grid-12 o-grid-9@xl">
                    <article class="article">
                        @yield('doc-content')
                    </article>
                </div>
                <div class="o-grid-12 o-grid-3@xl">
                    @include('layout.partials.doc-aside', ['pageNow' => $pageNow ?? null])
                </div>
            </div>
        </div>
    </div>
@stop
