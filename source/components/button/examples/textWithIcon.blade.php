@foreach (['basic', 'filled', 'outlined'] as $style)

    @foreach (['sm', 'md', 'lg'] as $size)
        
            @button([
                'icon' => 'close',
                'reversePositions' => true,
                'text' => 'Reversed',
                'style' => $style,
                'size' => $size
            ])
            @endbutton

            @button([
                'icon' => 'close',
                'text' => 'Not reversed',
                'style' => $style,
                'size' => $size
            ])
            @endbutton

    @endforeach

    <br>

@endforeach