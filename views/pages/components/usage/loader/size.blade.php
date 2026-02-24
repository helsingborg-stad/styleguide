@foreach(['linear', 'circular'] as $shape)
    <div class="grid">
        @foreach(['sm', 'md', 'lg'] as $size)
            <div class="grid-ms-4 grid-md-4 grid-lg-4 u-aspect-ratio--1-1">
                @loader(['shape' => $shape, 'size' => $size])
                @endloader
            </div>
        @endforeach
    </div>
@endforeach