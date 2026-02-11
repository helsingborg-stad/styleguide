@extends('layout.master')

@section('content')
@php
    $tokens = json_decode(file_get_contents(BASEPATH . 'source/data/design-tokens.json'), true);
@endphp

<div class="design-builder" data-design-builder data-tokens='@json($tokens)'>
    <noscript>
        <p>The Design Builder requires JavaScript to function.</p>
    </noscript>
</div>

{{-- Builder-specific assets (excluded from global Asset loading) --}}
@if(isset($assets['manifest']['css/design-builder.css']))
    <link rel="stylesheet" href="/assets/dist/{{ $assets['manifest']['css/design-builder.css'] }}">
@endif
@if(isset($assets['manifest']['js/design-builder.js']))
    <script src="/assets/dist/{{ $assets['manifest']['js/design-builder.js'] }}" type="module"></script>
@endif
@endsection
