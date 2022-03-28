<div class="o-grid">
    <div class="o-grid-4@md">
        @card([
            'heading' => 'Heading',
            'subHeading' => 'SubHeading', 
            'content' => 'Atoms are the fundemental building blocks. They are rarely used just by them self but mostly used to build more advanced components.',
            'image' => [
                'src' => 'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80',
                'alt' => 'ALT', 
                'backgroundColor' => 'secondary',
                'square' => true
            ],
            'date' => date('Y-m-d H:i:s'),
            'dateBadge' => true
        ])
        @endcard
    </div>
    <div class="o-grid-4@md">
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
            ],
            'date' => date('Y-m-d H:i:s')
        ])
        @endcard
    </div>
</div>