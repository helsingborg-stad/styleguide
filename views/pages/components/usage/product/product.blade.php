<div class="o-grid">
    <div class="o-grid-4@md">
        @product([
            'heading' => 'Heading 1',
            'label' => 'Atoms are the fundemental building blocks. They are rarely used just by them self but mostly used to build more advanced components.',
            'image' => [
                'src' => '/assets/img/component.svg',
                'alt' => 'ALT', 
                'backgroundColor' => 'secondary',
                'padded' => true
            ],
            'prices' => [
                ['amount' => '249', 'currency' => 'kr', 'frequency' => 'mon'],
                ['amount' => '399', 'currency' => 'kr', 'frequency' => 'yr', 'backgroundColor' => 'secondary']
            ],
            'bulletPoints' => [
                ['label' => 'Lorem'],
                ['label' => 'Ipsum']
            ],
            'button' => ['type' => 'filled', 'color' => 'primary', 'text' => 'Buy', 'href' => '#']
        ])
        @endproduct
    </div>
    <div class="o-grid-4@md">
        @product([
            'heading' => 'Heading 2',
            'label' => 'Atoms are the fundemental building blocks. They are rarely used just by them self but mostly used to build more advanced components.',
            'image' => [
                'src' => '/assets/img/component.svg',
                'alt' => 'ALT', 
                'backgroundColor' => 'secondary',
                'padded' => true
            ],
            'meta' => 'Everything in heading 1 is included',
            'prices' => [
                ['amount' => '349', 'currency' => 'kr', 'frequency' => 'mon'],
                ['amount' => '499', 'currency' => 'kr', 'frequency' => 'yr']
            ],
            'bulletPoints' => [
                ['label' => 'Lorem'],
                ['label' => 'Ipsum']
            ],
            'button' => ['type' => 'filled', 'color' => 'primary', 'text' => 'Buy', 'href' => '#']
        ])
        @endproduct
    </div>
</div>