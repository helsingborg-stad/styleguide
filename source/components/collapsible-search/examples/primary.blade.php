{{-- Primary colour trigger. --}}
<div class="u-display--flex u-justify-content--end" style="min-height:64px;align-items:center">
    @collapsibleSearch([
        'button' => [
            'text'  => 'Search',
            'icon'  => ['name' => 'search'],
            'style' => 'filled',
            'color' => 'primary',
            'size'  => 'md',
        ],
    ])
    @endcollapsibleSearch
</div>
