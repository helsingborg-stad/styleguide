<div class="grid">
    <div class="grid-sm-12 grid-md-4"
@card([
    'collapsible' => true,
    'heading' => 'Heading',
    'subHeading' => 'SubHeading', 
    'content' => 'Atoms are the fundemental building blocks. They are rarely used just by them self but mostly used to build more advanced components.',
    'image' => ['src' => 'https://www.w3schools.com/w3css/img_lights.jpg', 'alt' => 'ALT'],
    'imageFirst' => true,
    'dropdown' => [
        'items' => [['text' => 'test']],
        'buttonColor' => 'white'
    ],
    'buttons' => [
            ['type' => 'filled', 'color' => 'primary', 'text' => 'Lets go!'],
            ['type' => 'filled', 'color' => 'primary', 'text' => 'Lets go!']
        ]
])
@endcard