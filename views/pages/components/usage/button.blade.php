//Regular button
@button(
    [
        'href' => 'www.test.com',
        'text' => 'Button',
        'icon' => ['name' => 'close'],
        'size' => 'lg',
        'floating' => ['animate' => true, 'hover' => true]
    ]
)
@endbutton

//Icon Button
@button(
    [
        'isIconButton' =>  true,
        'icon' => ['name' => 'close', 'color' => 'black', 'size' => 'md'],
        'floating' => ['animate' => true, 'hover' => true]
    ]
)
@endbutton
