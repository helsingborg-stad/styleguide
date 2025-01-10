Here are examples!


<div style="height: 400px; overflow: auto; background-color: rgba(0,0,0,.1); position: relative;">
    @toast(['position' => 'top-right', 'attributeList' => ['style' => 'position: absolute;']])
       
        @toast__item([
            'type' => 'info',
            'message' => [
                'text' => 'This message has an action button and may be dismissed, it will not dissapear automatically.',
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
        @endtoast__item

        @toast__item([
            'type' => 'info',
            'message' => [
                'text' => 'This message may be dismissed, it will not dissapear automatically.',
            ],
            'dismissable' => 'immediate',
            'icon' => [
                'name' => 'check',
                'size' => 'md',
                'color' => 'white'
            ]
        ])
        @endtoast__item

        @toast__item([
            'type' => 'info',
            'message' => [
                'text' => 'This has a button to do a task but no dismiss action and will have double the time for hidden.',
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
        @endtoast__item


        @toast__item([
            'type' => 'info',
            'message' => [
                'text' => 'This neither has a button, or a dismiss and will be hidden first.',
            ],
            'icon' => [
                'name' => 'check',
                'size' => 'md',
                'color' => 'white'
            ]
        ])
        @endtoast__item
    @endtoast

</div>