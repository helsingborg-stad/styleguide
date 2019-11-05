@button(
    [
        'href' => '#',
        'isOutlined' => false,
        'background' => 'primary',
        'text' => 'Open Modal',
        'icon' => 'favorite',
        'size' => 'lg',
        'color' => 'secondary',
        'reverseIcon' => true,
        'floating' => true,
        'attributeList' => ['data-open' => "exampleModalId']
    ]
)
@endbutton

@modal(
    [
        'heading'=> "Hey, have you seen this?",
        'isPanel' => false,
        'id' => 'exampleModalId',
        'overlay' => 'dark',
        'animation' => 'scale-up'
    ]
)
    This is the content of the modal. It can also be another component.
@endmodal