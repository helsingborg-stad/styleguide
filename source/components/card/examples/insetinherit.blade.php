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
        <div class="c-card__header">
            <h3 class="c-card__heading">Heading</h3>
        </div>


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

<br/>
<div style="border: 2px solid; padding: 20px;  width: 70%; resize: horizontal; overflow: auto;">
    @card([
        'collapsible' => false,
        'heading' => 'Heading',
    ])
        @element([
            'componentElement' => 'div',
            'classList' => ['c-card__header']
        ])
            @typography([
                'variant' => 'h3',
                'classList' => ['c-card__heading']
            ])
                Heading
            @endtypography
        @endelement
        @collection([])
            @for($i = 0; $i < 6; $i++)
                
                @php 
                    $randomLabels = [
                        'Lorem ipsum dolor sit amet',
                        'Consectetur adipiscing elit',
                        'Sed do eiusmod tempor incididunt',
                        'Ut labore et dolore magna aliqua',
                        'Ut enim ad minim veniam',
                        'Quis nostrud exercitation ullamco',
                        'Laboris nisi ut aliquip ex ea',
                        'Commodo consequat duis aute irure',
                        'Dolor in reprehenderit in voluptate',
                        'Velit esse cillum dolore eu fugiat'
                    ];
                    $randomLabel = $randomLabels[array_rand($randomLabels)];
                @endphp

                @collection__item(['icon' => 'arrow_forward', 'link' => '#'])
                    {{ $randomLabel }}
                @endcollection__item
            @endfor
        @endcollection
    @endcard
</div>
@typography([
    'variant' => 'meta'
])
    Drag the container above to see the card and nested accordion inherit the inset spacing.
@endtypography
