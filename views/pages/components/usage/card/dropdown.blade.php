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
                'items' => [
                    ['text' => 'test', 'link' => "https://helsingborg.se"],
                    ['text' => 'test', 'link' => "https://helsingborg.se"],
                    ['text' => 'test', 'link' => "https://helsingborg.se"]
                ],
                'buttonColor' => 'black'
            ]
        ])
        @notice([
            'type' => 'success',
            'message' => [
                'text' => 'Tellus Sem Lorem Malesuada Ipsum',
                'size' => 'sm'
            ],
            'icon' => [
                'name' => 'check',
                'size' => 'md',
                'color' => 'white'
            ]
        ])
        @endnotice
        @endcard
    @endgrid
@endgrid