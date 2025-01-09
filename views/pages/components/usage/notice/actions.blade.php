@foreach (['info', 'success', 'danger', 'warning'] as $type)
    @notice([
        'type' => $type,
        'message' => [
            'text' => 'This message has an action button and may be dismissable.',
        ],
        'action' => [
            'text' => 'Go to home',
            'url' => '#'
        ],
        'dismissable' => true,
        'icon' => [
            'name' => 'check',
            'size' => 'md',
            'color' => 'white'
        ]
    ])
    @endnotice

    @notice([
        'type' => $type,
        'message' => [
            'text' => 'This message is simply dismissable.',
        ],
        'dismissable' => true,
        'icon' => [
            'name' => 'check',
            'size' => 'md',
            'color' => 'white'
        ]
    ])
    @endnotice

    @notice([
        'type' => $type,
        'message' => [
            'text' => 'This has a button to do a task but no dismiss action.',
        ],
        'action' => [
            'text' => 'Undo',
            'url' => '#'
        ],
        'icon' => [
            'name' => 'check',
            'size' => 'md',
            'color' => 'white'
        ]
    ])
    @endnotice
@endforeach