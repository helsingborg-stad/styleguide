@dropdown([
'items' => [ ['text' => 'cool', 'link' => '#'], ['text' => 'story', 'link' => '#'], ['text' => 'bro', 'link' => '#']],
'direction' => 'left',
'popup' => 'hover'
])
    @button([
        'text' => 'Hover',
        'icon' => 'keyboard_arrow_down',
        'size' => 'md'
        
    ])
    @endbutton
@enddropdown