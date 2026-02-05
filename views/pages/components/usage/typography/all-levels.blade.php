
@foreach(["h1", "h2", "h3", "h4", "h5", "h6"] as $variant)
    @typography([
        "element" => $variant,
        "variant" => $variant,
    ])
        Element {{ $variant }}
    @endtypography
@endforeach