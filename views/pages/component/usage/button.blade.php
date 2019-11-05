//Regular button
@button(
    [
        'href' => 'www.test.com',
        'text' => 'Button',
        'icon' => ['name' => 'close'],
        'background' => 'secondary'
        'size' => 'lg',
        'reverseIcon' => false,
        'floating' => ['animate' => true, 'hover' => true]
    ]
)
@endbutton

//Icon Button
@button(
    [
        'isIconButton' =>  true,
        'icon' => ['name' => 'close', 'color' => 'black', 'size' => 'md'],
        'floating' => ['animate' => true, 'hover' => true],
        'background' => false
    ]
)
@endbutton
