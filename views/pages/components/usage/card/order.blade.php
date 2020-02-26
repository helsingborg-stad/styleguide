<div class="grid">
    <div class="grid-md-4">
        @card([
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
        @endcard
    </div>

    <div class="grid-md-4">
        @card([
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
        @endcard
    </div>
</div>