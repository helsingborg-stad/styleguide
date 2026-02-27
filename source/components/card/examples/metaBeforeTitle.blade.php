<div class="o-grid">
    <div class="o-grid-4@md">
        @card([
            'color' => 'primary',
            'heading' => 'Heading',
            'subHeading' => 'SubHeading', 
            'content' => 'Atoms are the fundemental building blocks. They are rarely used just by them self but mostly used to build more advanced components.',
            'image' => [
                'src' => '/assets/img/component.svg',
                'alt' => 'ALT', 
                'backgroundColor' => 'secondary',
                'padded' => true
            ],
            'meta' => "This is the meta (after title)",
            'date' => date('Y-m-d H:i:s')
        ])
        @endcard
    </div>
    <div class="o-grid-4@md">
        @card([
            'color' => 'primary',
            'heading' => '123 AVC Heading',
            'subHeading' => 'SubHeading', 
            'content' => 'Atoms are the fundemental building blocks. They are rarely used just by them self but mostly used to build more advanced components.',
            'image' => [
                'src' => '/assets/img/component.svg',
                'alt' => 'ALT', 
                'backgroundColor' => 'secondary',
                'padded' => true
            ],
            'meta' => "This is the meta (before title)",
            'metaFirst' => true,
            'date' => date('Y-m-d H:i:s')
        ])
        @endcard
    </div>
</div>