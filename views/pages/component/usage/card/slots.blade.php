@card([
])

    @image([
        'src' => "https://picsum.photos/300/200?image=1004",
        'alt' => "I'm a Image build with the image component",
        'classList' => ["c-card__image"]
    ])
    @endimage

    @typography([
        'variant' => "h3",
        'element' => "h3",
        'classList' => ["c-card__title"]
    ])
        I'm a Title created with Typography component
    @endtypography

    @heading([
        'label' => 'I am a byline, created with the heading component',
        'level' => 4
    ])
    @endbutton

    This nice text is just plain text wich is not createcd by any component. But you can use the
    typography component.

    <br /><br />
    @button([
        'href' => "#",
        'text' => "Button component",
        'toggle' => true,
        'type' => 'filled',
        'color' => "primary",
        'attributeList' => ['tabindex' => "1"],
        'classList' => ["c-button__button"]
    ])
    @endbutton


    @button([
        'href' => "#",
        'text' => "Button component",
        'toggle' => true,
        'type' => 'filled',
        'color' => "secondary",
        'attributeList' => ['tabindex' => "1"],
        'classList' => ["c-button__button"]
    ])
    @endbutton

@endcard