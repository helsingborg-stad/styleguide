
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