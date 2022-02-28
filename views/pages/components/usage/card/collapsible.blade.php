<div class="o-grid">
    <div class="o-grid-4@md">
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
    </div>
</div>