@typography([])
    Try me in a screen reader (.u-sr__only). Hidden element -> 
    @link([
        'classList' => ['u-sr__only'],
        'href' => '#'
    ])
        Here is the hidden content without the modifier.
    @endlink
@endtypography

@typography([])
    Try me in a screen reader (.u-sr__only--focusable). Hidden element ->
    @link([
        'classList' => ['u-sr__only--focusable'],
        'href' => '#'
    ])
        Here is the hidden content with the modifier.
    @endlink
@endtypography
