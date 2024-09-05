<?php 
    $labels = [
        'dateLabels' => [
            'year' => 'år',
            'month' => 'månad',
            'week' => 'vecka',
            'day' => 'dag',
            'hour' => 'timme',
            'minute' => 'minut',
            'second' => 'sekund'
            ],
        'dateLabelsPlural' => [
            'year' => 'år',
            'month' => 'månader',
            'week' => 'veckor',
            'day' => 'dagar',
            'hour' => 'timmar',
            'minute' => 'minuter',
            'second' => 'sekund'
        ]
    ];
?>



@comment([
    'author' => 'Peter Svensson',
    'author_url' => '#',
    'text' => 'This is a comment text',
    'icon' => 'face',
    'date' => date("Y-m-d H:i:s", strtotime('-2 years -6 months -3days -5 hours -10 minutes -20 seconds')),
    'dateLabels' => $labels['dateLabels'],
    'dateLabelsPlural' => $labels['dateLabelsPlural']
])
    @slot('actions')
        @button([
            'text' => 'Reply',
            'color' => 'default',
            'style' => 'basic',
            'href' => '#reply',
            'icon' => 'reply',
            'size' => 'sm'
        ])
        @endbutton

        @button([
            'text' => 'Like',
            'color' => 'default',
            'style' => 'basic',
            'href' => '#like',
            'icon' => 'thumb_up',
            'size' => 'sm'
        ])
        @endbutton
    @endslot
@endcomment

@comment([
    'author' => 'Peter Olsson',
    'text' => 'This is a reply comment text',
    'icon' => 'face',
    'author_image' => 'https://picsum.photos/id/338/70/70',
    'date' => date("Y-m-d H:i:s", strtotime('-1 year -1 month -5 days')),
    'is_reply' => true,
    'dateLabels' => $labels['dateLabels'],
    'dateLabelsPlural' => $labels['dateLabelsPlural']
])
@endcomment

@comment([
    'author' => 'Peter Olsson',
    'text' => 'This is a reply comment text, it was written now.',
    'icon' => 'face',
    'author_image' => 'https://picsum.photos/id/342/70/70',
    'date' => date("Y-m-d H:i:s"),
    'is_reply' => true,
    'dateLabels' => $labels['dateLabels'],
    'dateLabelsPlural' => $labels['dateLabelsPlural']
])
@endcomment

@comment([
    'author' => 'Peter Olsson',
    'text' => 'This is a reply comment text, it was written five hours ago.',
    'icon' => 'face',
    'author_image' => 'https://picsum.photos/id/64/70/70',
    'date' => date("Y-m-d H:i:s", strtotime('-5 hours')),
    'is_reply' => true,
    'dateLabels' => $labels['dateLabels'],
    'dateLabelsPlural' => $labels['dateLabelsPlural']
])
@endcomment

@comment([
    'author' => 'Peter Svensson',
    'date' => date("Y-m-d H:i:s", strtotime('-1 year')),
    'dateLabels' => $labels['dateLabels'],
    'dateLabelsPlural' => $labels['dateLabelsPlural']
])
    This comment <u>content</u> was sent through the slot.
@endcomment