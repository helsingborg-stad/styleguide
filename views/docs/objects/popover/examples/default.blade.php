<div class="u-display--flex u-flex-direction--column u-gap--2">
    @typography(['variant' => 'body', 'element' => 'p'])
        Click on the trigger to show the popover.
        The default behavior for popover is to position itself in the center of the viewport.
    @endtypography

    @button([
        'text' => 'Popover trigger',
        'attributeList' => [
            'popovertarget' => 'abc',
        ]
    ])
    @endbutton
    @card([
        'heading' => "I'm a popover!",
        'attributeList' => [
            'popover' => 'auto',

        ],
        'id' => 'abc',
    ])
    @endcard
</div>