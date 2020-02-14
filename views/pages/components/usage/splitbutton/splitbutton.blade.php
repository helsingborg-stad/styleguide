@splitbutton([
    'items' => [ ['text' => 'meh', 'link' => '#'], ['text' => 'story'], ['text' => 'bro']],
    'color' => 'secondary',
    'buttonText' => 'Choose an item!',
    'icon' => 'keyboard_arrow_up',
    'dropdownDirection' => 'top'
])
@endsplitbutton

@splitbutton([
    'items' => [ ['text' => 'cool'], ['text' => 'story'], ['text' => 'bro']],
    'color' => 'default',
    'buttonText' => 'Choose an item!',
    'icon' => 'keyboard_arrow_down',
    'dropdownDirection' => 'bottom'
])
@endsplitbutton