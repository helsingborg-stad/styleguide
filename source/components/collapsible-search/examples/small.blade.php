{{-- Small size variant --}}
<div class="u-display--flex u-justify-content--end" style="min-height:48px;align-items:center">
    @collapsiblesearch([
        'button' => [
            'text'  => 'Search',
            'icon'  => ['name' => 'search'],
            'style' => 'filled',
            'color' => 'default',
            'size'  => 'sm',
        ],
    ])
    @endcollapsiblesearch
</div>
