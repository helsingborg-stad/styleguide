@dropdown([
'items' => [ ['text' => 'cool', 'link' => '#'], ['text' => 'story', 'link' => '#'], ['text' => 'bro', 'link' => '#']],
'direction' => 'left',
'popup' => 'click'
])
    @button([
        'text' => 'Click',
        'icon' => 'keyboard_arrow_down',
        'size' => 'md'
        
    ])
    @endbutton
@enddropdown