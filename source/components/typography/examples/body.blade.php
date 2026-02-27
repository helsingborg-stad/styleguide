{{-- Document body text variants (body, p, bold) --}}
@php
$variants = ['body', 'p', 'bold'];
@endphp

@foreach($variants as $variant)
    @typography([
        "element" => $variant === 'p' ? 'p' : 'div',
        "variant" => $variant,
    ])
        Variant: {{ $variant }}
    @endtypography
@endforeach
