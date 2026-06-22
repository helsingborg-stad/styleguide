{{-- Document small text variants (caption, byline, meta) --}}
@php
$variants = ['caption', 'byline', 'meta'];
@endphp

@foreach($variants as $variant)
    @typography([
        "element" => 'div',
        "variant" => $variant,
        "useHeadingsContext" => false,
    ])
        Variant: {{ $variant }}
    @endtypography
@endforeach
