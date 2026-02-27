<div style="min-height: 100px">
    @select([
        'label' => 'Filter by category',
        'placeholder' => 'All categories',
        'classList' => ['c-select--rounded'],
        'options' => [
            'all'    => 'All categories',
            'news'   => 'News',
            'events' => 'Events',
            'about'  => 'About',
        ]
    ])
    @endselect
</div>
