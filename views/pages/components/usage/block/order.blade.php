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
            'subHeading' => 'SubHeading', 
            'content' => 'Atoms are the fundemental building blocks. They are rarely used just by them self but mostly used to build more advanced components.',
            'image' => [
                'src' => '/assets/img/component.svg',
                'alt' => 'ALT', 
                'backgroundColor' => 'secondary',
                'padded' => true
            ]
        ])
        @endblock
    @endgrid

    @grid([])
        @block([
            'heading' => 'Heading',
            'subHeading' => 'SubHeading', 
            'imageFirst' => true,
            'content' => 'Atoms are the fundemental building blocks. They are rarely used just by them self but mostly used to build more advanced components.',
            'image' => [
                'src' => '/assets/img/component.svg',
                'alt' => 'ALT', 
                'backgroundColor' => 'secondary',
                'padded' => true
            ]
        ])
        @endblock
    @endgrid
@endgrid
