{{-- Default (collapsed) state. Placed right-aligned to show the
     panel expanding left, as it would in a real header. --}}
<div class="u-display--flex u-justify-content--end" style="min-height:64px;align-items:center">
    @collapsibleSearch([
        'button' => [
            'text'  => 'Search',
            'icon'  => ['name' => 'search'],
            'style' => 'filled',
            'color' => 'default',
            'size'  => 'md',
        ],
    ])
    @endcollapsibleSearch
</div>
