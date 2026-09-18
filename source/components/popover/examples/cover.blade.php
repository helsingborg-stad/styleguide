@button([
    'attributeList' => [
        'popovertarget' => 'popover-cover',
    ]
])
    Cover Page
@endbutton
@popover([
    'id' => 'popover-cover',
    'attributeList' => [
        'data-js-popover-cover' => 'true',
    ]
])
    @card([
        'attributeList' => [
            'style' => 'height: 100%;width:100%;'
        ],
        'heading' => "Full-page cover",
        'content' => "This popover uses data-js-popover-cover to cover the whole viewport instead of being placed relative to the trigger or viewport edges."
    ])
    @endcard
@endpopover
