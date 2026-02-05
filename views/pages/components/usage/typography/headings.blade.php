{{-- Document heading levels (h1-h6) --}}
@php
$variants = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
@endphp

@foreach($variants as $variant)
    @typography([
        "element" => $variant,
        "variant" => $variant,
    ])
        Variant: {{ $variant }}
    @endtypography
@endforeach
