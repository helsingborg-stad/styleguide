
@comment([
    'author' => 'Peter Svensson',
    'author_url' => '#',
    'text' => 'This is a comment text',
    'icon' => 'face',
    'date' => '2019-12-01 17:25:43'
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
    'author_image' => 'https://picsum.photos/70/70?image=64',
    'date' => '2020-01-01 17:25:43',
    'is_reply' => true
])
@endcomment

@comment([
    'author' => 'Peter Svensson',
    'date' => '2020-01-09 17:25:43',
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
])
    This comment was sent through the slot
@endcomment