{{-- Large size variant --}}
<div class="u-display--flex u-justify-content--end" style="min-height:80px;align-items:center">
    @collapsibleSearch([
        'button' => [
            'text'  => 'Search',
            'icon'  => ['name' => 'search'],
            'style' => 'filled',
            'color' => 'default',
            'size'  => 'lg',
        ],
    ])
    @endcollapsibleSearch
</div>
