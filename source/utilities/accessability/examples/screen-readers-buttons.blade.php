<div class="u-color__bg--default u-rounded u-padding--2 u-margin__bottom--5">
    <button class="u-sr__only">Screen reader only</button>

@button([
    'size' => 'md',
    'classList' => ['u-sr__only'],
    'href' => '#',
    'color' => 'primary',
    'style' => 'filled'
])
    Screen reader only button
@endbutton

@button([
    'size' => 'md',
    'classList' => ['u-sr__only--focusable'],
    'href' => '#',
    'color' => 'primary',
    'style' => 'filled'
])
    Visible when focused, screen reader only button
@endbutton
