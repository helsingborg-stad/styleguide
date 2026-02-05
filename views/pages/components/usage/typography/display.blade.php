{{-- Document display text variants (headline, title, subtitle) --}}
@php
$variants = ['headline', 'title', 'subtitle'];
@endphp

@foreach($variants as $variant)
    @typography([
        "element" => 'div',
        "variant" => $variant,
    ])
        Variant: {{ $variant }}
    @endtypography
@endforeach
