Here are examples!

@toast(['position' => 'top-right'])
    @notice([
        'type' => 'info',
        'message' => [
            'text' => 'This message has an action button and may be dismissed.',
        ],
        'action' => [
            'text' => 'Go to home',
            'url' => '#'
        ],
        'dismissable' => 'immediate',
        'icon' => [
            'name' => 'check',
            'size' => 'md',
            'color' => 'white'
        ]
    ])
    @endnotice

    @notice([
        'type' => 'info',
        'message' => [
            'text' => 'This message may be dismissed.',
        ],
        'dismissable' => 'immediate',
        'icon' => [
            'name' => 'check',
            'size' => 'md',
            'color' => 'white'
        ]
    ])
    @endnotice

    @notice([
        'type' => 'info',
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
@endtoast