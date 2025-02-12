@button(
    [
        'href' => '',
        'isOutlined' => false,
        'text' => 'Open Modal',
        'icon' => ['name' =>'favorite'],
        'size' => 'lg',
        'color' => 'secondary',
        'floating' => true,
        'attributeList' => ['data-open' => 'exampleModalId']
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