{{-- Document specialized text variants (marketing, email) --}}
@php
$variants = ['marketing', 'email'];
@endphp

@foreach($variants as $variant)
    @typography([
        "element" => 'div',
        "variant" => $variant,
    ])
        Variant: {{ $variant }}
    @endtypography
@endforeach
