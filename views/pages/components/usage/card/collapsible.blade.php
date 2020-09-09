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
            'collapsible' => true,
            'heading' => 'Heading',
            'subHeading' => 'SubHeading', 
            'content' => 'Atoms are the fundemental building blocks. They are rarely used just by them self but mostly used to build more advanced components.',
            'image' => ['src' => 'https://www.w3schools.com/w3css/img_lights.jpg', 'alt' => 'ALT'],
            'imageFirst' => true,
            'dropdown' => [
                'items' => [['text' => 'test', 'link' => 'https://helsingborg.se']],
                'buttonColor' => 'white'
            ]
        ])
        @endcard
    @endgrid
@endgrid