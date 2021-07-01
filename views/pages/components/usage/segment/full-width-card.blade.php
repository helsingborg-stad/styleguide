@segment([
    'layout'            => 'full-width',
    'image'             => 'https://i.picsum.photos/id/308/1536/1024.jpg?hmac=sENdBVMjJ5k40eSlDyPh8CZKbXjOm1S73hukmgfyMKQ',
    'background'        => 'primary',
    'textColor'         => 'light',
    'overlay'           => 'dark'
])

    <div class="o-grid">

        <div class="o-grid-4@lg">
            @card([
                'heading' => 'Heading',
                'subHeading' => 'SubHeading', 
                'content' => 'Atoms are the fundemental building blocks. They are rarely used just by them self but mostly used to build more advanced components.',
                'image' => [
                    'src' => 'https://picsum.photos/400/300?a',
                    'alt' => 'ALT', 
                    'backgroundColor' => 'secondary'
                ]
            ])
            @endcard
        </div>

        <div class="o-grid-4@lg">
            @card([
                'heading' => 'Heading',
                'subHeading' => 'SubHeading', 
                'content' => 'Atoms are the fundemental building blocks. They are rarely used just by them self but mostly used to build more advanced components.',
                'image' => [
                    'src' => 'https://picsum.photos/400/300?b',
                    'alt' => 'ALT', 
                    'backgroundColor' => 'secondary'
                ]
            ])
            @endcard
        </div>

        <div class="o-grid-4@lg">
            @card([
                'heading' => 'Heading',
                'subHeading' => 'SubHeading', 
                'content' => 'Atoms are the fundemental building blocks. They are rarely used just by them self but mostly used to build more advanced components.',
                'image' => [
                    'src' => 'https://picsum.photos/400/300?c',
                    'alt' => 'ALT', 
                    'backgroundColor' => 'secondary'
                ]
            ])
            @endcard
        </div>

    </div>

@endsegment