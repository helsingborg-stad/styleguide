@grid([
    "container" => true,
    "columns" => "auto-fit",
    "min_width" => "300px",
    "max_width" => "400px",
    "col_gap" => 5,
    "row_gap" => 5
])
    @grid([])
        @card([
            'heading' => 'Heading',
            'subHeading' => 'SubHeading', 
            'content' => 'Atoms are the fundemental building blocks. They are rarely used just by them self but mostly used to build more advanced components.',
            'dropdown' => [
                'items' => [['text' => 'test'], ['text' => 'test'], ['text' => 'test']],
                'buttonColor' => 'black'
            ]
        ])
        @endcard
    @endgrid
@endgrid