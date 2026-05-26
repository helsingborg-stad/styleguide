<div style="border: 2px solid; padding: 20px;  width: 70%; resize: horizontal; overflow: auto;">
    @card([
        'collapsible' => false,
        'heading' => 'Heading',
        'content' => 'Atoms are the fundemental building blocks. They are rarely used just by them self but mostly used to build more advanced components. Atoms are the fundemental building blocks. They are rarely used just by them self but mostly used to build more advanced components. Atoms are the fundemental building blocks. They are rarely used just by them self but mostly used to build more advanced components. Atoms are the fundemental building blocks. They are rarely used just by them self but mostly used to build more advanced components.',
        'image' => ['src' => 'https://www.w3schools.com/w3css/img_lights.jpg', 'alt' => 'ALT'],
        'buttons' => [
            ['type' => 'filled', 'color' => 'primary', 'text' => 'Lets go!'],
            ['type' => 'filled', 'color' => 'primary', 'text' => 'Lets go!']
        ],
    ])
        @accordion([
            'list' => [
                [
                    'heading' => 'Accordion heading',
                    'content' => 'Accordion content should keep the same inset rhythm as the rest of the card when the container grows.'
                ],
                [
                    'heading' => 'Accordion heading',
                    'content' => 'Accordion content should keep the same inset rhythm as the rest of the card when the container grows.'
                ],
                [
                    'heading' => 'Accordion heading',
                    'content' => 'Accordion content should keep the same inset rhythm as the rest of the card when the container grows.'
                ]
            ]
        ])
        @endaccordion
    @endcard
</div>
<br/>
<div style="border: 2px solid; padding: 20px;  width: 70%; resize: horizontal; overflow: auto;">
    @card([
        'collapsible' => false,
        'heading' => 'Heading',
        'content' => 'Atoms are the fundemental building blocks. They are rarely used just by them self but mostly used to build more advanced components. Atoms are the fundemental building blocks. They are rarely used just by them self but mostly used to build more advanced components. Atoms are the fundemental building blocks. They are rarely used just by them self but mostly used to build more advanced components. Atoms are the fundemental building blocks. They are rarely used just by them self but mostly used to build more advanced components.',
        'buttons' => [
            ['type' => 'filled', 'color' => 'primary', 'text' => 'Lets go!'],
            ['type' => 'filled', 'color' => 'primary', 'text' => 'Lets go!']
        ],
    ])
    @endcard
</div>
@typography([
    'variant' => 'meta'
])
    Drag the container above to see the card and nested accordion inherit the inset spacing.
@endtypography
