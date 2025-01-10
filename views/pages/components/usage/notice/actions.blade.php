@foreach(['immediate','session', 'permanent'] as $timeout)
    @foreach (['info', 'success', 'danger', 'warning'] as $type)
        @notice([
            'type' => $type,
            'message' => [
                'text' => 'This message has an action button and may be dismissed (Type: '.$type.', Timeout: '.$timeout. ', Iteration: ' .$loop->iteration.').',
            ],
            'action' => [
                'text' => 'Go to home',
                'url' => '#'
            ],
            'dismissable' => $timeout,
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
                'text' => 'This message may be dismissed (Type: '.$type.', Timeout: '.$timeout. ', Iteration: ' .$loop->iteration.').',
            ],
            'dismissable' => $timeout,
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
                'text' => 'This has a button to do a task but no dismiss action (Type: '.$type.', Timeout: '.$timeout. ', Iteration: ' .$loop->iteration.').',
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
@endforeach