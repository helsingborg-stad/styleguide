<div style="min-height: 50px">
    @form([
        'method' => 'GET',
        'action' => '?q=select-error'
    ])
        @select([
            'label' => 'Choose a category',
            'placeholder' => 'Select a category',
            'errorMessage' => 'Please select a valid category.',
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
