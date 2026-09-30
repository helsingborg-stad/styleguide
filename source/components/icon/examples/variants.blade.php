@foreach (['outlined', 'rounded', 'sharp'] as $variant)
    @foreach ([200, 400, 600] as $weight)
        @icon(['icon' => 'home', 'variant' => $variant, 'weight' => $weight, 'size' => 'lg'])
    @endforeach
@endforeach
