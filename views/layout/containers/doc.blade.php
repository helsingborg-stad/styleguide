@extends('layout.master')

@section('content')
    <div class="container--doc l-docs--content">
            @hasSection('doc-hero')
                @yield('doc-hero')
            @endif

            <div class="o-grid o-grid--large u-margin__top--2">
                <div class="o-grid-12">
                    <article class="article">
                        @yield('doc-content')
                    </article>
                </div>
            </div>
        </div>
@stop
