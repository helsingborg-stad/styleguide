{{-- Primary colour trigger. --}}
<div class="u-display--flex u-justify-content--end" style="min-height:64px;align-items:center">
    @collapsiblesearch([
        'button' => [
            'text'  => 'Search',
            'icon'  => ['name' => 'search'],
            'style' => 'filled',
            'color' => 'primary',
            'size'  => 'md',
        ],
    ])
    @endcollapsiblesearch
</div>
