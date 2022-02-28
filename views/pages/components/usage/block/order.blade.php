<div class="o-grid">
    <div class="o-grid-6@sm o-grid-3@md">
        @block([
            'heading' => 'Heading',
            'meta' => 'Meta',
            'filled' => true,
            'image' => [
                'src' => '/assets/img/1038-900x600.jpg',
                'alt' => 'ALT', 
                'backgroundColor' => 'secondary',
            ],
            'classList' => ['u-height--100']
        ])
        @endblock
    </div>
    <div class="o-grid-6@sm o-grid-3@md">
        @block([
            'heading' => 'Heading',
            'ratio' => '12:16',
            'meta' => 'Meta',
            'filled' => true,
            'image' => [
                'src' => '/assets/img/1038-900x600.jpg',
                'alt' => 'ALT', 
                'backgroundColor' => 'secondary',
            ],
            'classList' => ['u-height--100']
        ])
        @endblock
    </div>
</div>