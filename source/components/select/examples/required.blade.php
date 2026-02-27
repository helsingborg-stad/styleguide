<div style="min-height: 100px">
    @form([
        'method' => 'GET',
        'action' => '?q=select-required'
    ])
        @select([
            'label' => 'Choose a topic',
            'required' => true,
            'placeholder' => 'Select a topic',
            'options' => [
                'news'    => 'News',
                'sports'  => 'Sports',
                'culture' => 'Culture',
                'science' => 'Science',
            ]
        ])
        @endselect
    @endform
</div>
