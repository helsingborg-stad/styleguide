@card([])
    @card__header()
        @typography([
            'element' => "h4"
        ])
            Accordion in a card
        @endtypography
    @endcard__header

    @accordion([])
        @for ($i = 0; $i < 3; $i++)
            @accordion__item([
                'heading' => 'Lorem ipsum dolor sit amet',
            ])
                @typography(['element' => 'h2'])
                    Lorem Ipsum
                @endtypography

                @typography(['element' => 'p'])
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                @endtypography
            @endaccordion__item
        @endfor
    @endaccordion

    @card__footer()
        @button([
            'variant' => 'primary',
            'fullWidth' => true
        ])
            Read more
        @endbutton
    @endcard__footer
@endcard
