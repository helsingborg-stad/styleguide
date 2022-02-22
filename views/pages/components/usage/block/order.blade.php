@grid([
    "container" => true,
    "columns" => "auto-fit",
    "min_width" => "300px",
    "max_width" => "400px",
    "col_gap" => 5,
    "row_gap" => 5
])
    @grid([])
        @block([
            'heading' => 'Heading',
            'meta' => 'Meta',
            'filled' => true,
            'image' => [
                'src' => '/assets/img/1038-900x600.jpg',
                'alt' => 'ALT', 
                'backgroundColor' => 'secondary',
            ]
        ])
        @endblock
    @endgrid

    @grid([])
        @block([
            'heading' => 'Heading',
            'ratio' => '12:16',
            'meta' => 'Meta',
            'filled' => true,
            'image' => [
                'src' => '/assets/img/1038-900x600.jpg',
                'alt' => 'ALT', 
                'backgroundColor' => 'secondary',
            ]
        ])
        @endblock
    @endgrid
@endgrid
