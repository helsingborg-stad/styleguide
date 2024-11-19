<div class="o-grid">
    <div class="o-grid-4@md">
        @card([
            'heading' => 'With image',
            'subHeading' => 'SubHeading', 
            'content' => 'lorem ipsum dolor sit amet, consectetur adipiscing elit',
            'image' => [
                'src' => 'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80',
                'alt' => 'ALT', 
                'backgroundColor' => 'secondary',
                'square' => true
            ],
            'date' => date('Y-m-d H:i:s'),
            'dateBadge' => true,
            'containerAware' => true
        ])
        @endcard
    </div>
    <div class="o-grid-4@md">
        @card([
            'heading' => 'With Placeholder',
            'subHeading' => 'SubHeading', 
            'content' => 'lorem ipsum dolor sit amet, consectetur adipiscing elit',
            'image' => null,
            'date' => date('Y-m-d H:i:s'),
            'dateBadge' => true,
            'hasPlaceholder' => true,
            'containerAware' => true
        ])
        @endcard
    </div>
    <div class="o-grid-4@md">
        @card([
            'heading' => 'Without image',
            'subHeading' => 'SubHeading', 
            'content' => 'lorem ipsum dolor sit amet, consectetur adipiscing elit',
            'image' => null,
            'date' => date('Y-m-d H:i:s'),
            'dateBadge' => true,
            'containerAware' => true
        ])
        @endcard
    </div>
</div>