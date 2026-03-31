@extends('layout.master')

@section('content')
@php
    $tokens = json_decode(file_get_contents(BASEPATH . 'source/data/design-tokens.json'), true);
@endphp

    <div class="design-builder" data-tokens='@json($tokens)'>
        <noscript>
            <p>The Design Builder requires JavaScript to function.</p>
        </noscript>
    </div>

    <div class="container--doc l-docs--content">
            @hasSection('doc-hero')
                @yield('doc-hero')
            @endif

            <div class="o-grid o-grid--large u-margin__top--2">
                <div class="o-grid-12 {{ $hasDocAside ? 'o-grid-9@xl' : '' }}">
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
    {{-- Builder-specific assets (excluded from global Asset loading) --}}
@if(isset($assets['manifest']['css/component-editor.css']))
    <link rel="stylesheet" href="/assets/dist/{{ $assets['manifest']['css/component-editor.css'] }}">
@endif
@if(isset($assets['manifest']['js/component-editor.js']))
    <script src="/assets/dist/{{ $assets['manifest']['js/component-editor.js'] }}" type="module"></script>
@endif

@stop
