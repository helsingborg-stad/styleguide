<div class="o-grid">
    <div class="o-grid-4@md">
        @product([
            'heading' => 'Heading 1',
            'label' => 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            'image' => [
                'src' => '/assets/img/component.svg',
                'alt' => 'ALT', 
                'backgroundColor' => 'secondary',
                'padded' => true
            ],
            'prices' => [
                ['amount' => '249', 'currency' => ':-', 'frequency' => 'mon']
            ],
            'button' => ['type' => 'filled', 'text' => 'Buy', 'href' => '#']
        ])
        @endproduct
    </div>
    <div class="o-grid-4@md">
        @product([
            'heading' => 'Heading 2',
            'backgroundColor' => 'secondary',
            'label' => 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            'image' => [
                'src' => '/assets/img/component.svg',
                'alt' => 'ALT', 
                'backgroundColor' => 'secondary',
                'padded' => true
            ],
            'prices' => [
                ['amount' => '349', 'currency' => ':-', 'frequency' => 'mon']
            ],
            'button' => ['type' => 'filled', 'text' => 'Buy', 'href' => '#']
        ])
        @endproduct
    </div>
     <div class="o-grid-4@md">
        @product([
            'heading' => 'Heading 3',
            'backgroundColor' => 'custom',
            'label' => 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            'image' => [
                'src' => '/assets/img/component.svg',
                'alt' => 'ALT', 
                'backgroundColor' => 'secondary',
                'padded' => true
            ],
            'prices' => [
                ['amount' => '349', 'currency' => ':-', 'frequency' => 'mon']
            ],
            'button' => ['type' => 'filled', 'text' => 'Buy', 'href' => '#']
        ])
        @endproduct
    </div>
</div>