{{-- Pre-expanded state. Right-aligned wrapper shows the panel in context. --}}
<div class="u-display--flex u-justify-content--end" style="min-height:64px;align-items:center">
    @collapsibleSearch([
        'button' => [
            'text'  => 'Search',
            'icon'  => ['name' => 'search'],
            'style' => 'filled',
            'color' => 'default',
            'size'  => 'md',
        ],
        'isExpanded'  => true,
        'placeholder' => 'Type to search…',
    ])
    @endcollapsibleSearch
</div>
