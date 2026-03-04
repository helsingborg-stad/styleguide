@typography([])
    Applying the accessability utility class makes the element non-visible on the display but accessible for the screen reader.
@endtypography

@typography([])
    Try me in a screen reader (.u-sr__only).
    @link([
        'classList' => ['u-sr__only'],
        'href' => '#'
    ])
        Here is the hidden content without the modifier.
    @endlink
@endtypography

@typography([])
    Try me in a screen reader (.u-sr__only--focusable).
    @link([
        'classList' => ['u-sr__only--focusable'],
        'href' => '#'
    ])
        Here is the hidden content with the modifier.
    @endlink
@endtypography
