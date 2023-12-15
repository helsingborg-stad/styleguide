@dropdown([
'items' => [ ['text' => 'cool', 'link' => '#'], ['text' => 'story', 'link' => '#'], ['text' => 'bro', 'link' => '#']],
'direction' => 'left',
'popup' => 'click'
])
    @button([
        'text' => 'Left',
        'icon' => 'keyboard_arrow_left',
        'size' => 'md',
        'reversePositions' => true,
        'classList' => [
            'js-dropdown-button'
        ]
        
    ])
    @endbutton
@enddropdown

@dropdown([
'items' => [ ['text' => 'cool', 'link' => '#'], ['text' => 'story', 'link' => '#'], ['text' => 'bro', 'link' => '#']],
'direction' => 'right',
'popup' => 'click'
])
    @button([
        'text' => 'Right',
        'icon' => 'keyboard_arrow_right',
        'size' => 'md',
        'classList' => [
            'js-dropdown-button'
        ]
        
    ])
    @endbutton
@enddropdown


@dropdown([
'items' => [ ['text' => 'cool', 'link' => '#'], ['text' => 'story', 'link' => '#'], ['text' => 'bro', 'link' => '#']],
'direction' => 'top',
'popup' => 'click'
])
    @button([
        'text' => 'Up',
        'icon' => 'keyboard_arrow_up',
        'size' => 'md',
        'classList' => [
            'js-dropdown-button'
        ]
        
    ])
    @endbutton
@enddropdown

@dropdown([
'items' => [ ['text' => 'cool', 'link' => '#'], ['text' => 'story', 'link' => '#'], ['text' => 'bro', 'link' => '#']],
'direction' => 'down',
'popup' => 'click'
])
    @button([
        'text' => 'Down',
        'icon' => 'keyboard_arrow_down',
        'size' => 'md',
        'classList' => [
            'js-dropdown-button'
        ]
    ])
    @endbutton
@enddropdown
