@button([
    'text' => 'Disabled',
    'background' => 'disabled',
    'attributeList' => ['js-toggle-trigger' => '', 'disabled' => '']
])
@endbutton
@button([
    'text' => 'Disabled outlined',
    'toggle' => true,
    'isOutlined' => true,
    'color' => 'disabled',
    'attributeList' => ['js-toggle-trigger' => '', 'disabled' => '']
])
@endbutton
@button([
    'isIconButton' =>  true,
    'icon' => ['name' => 'close', 'color' => 'black', 'size' => 'md'],
    'background' => 'primary',
    'attributeList' => ['disabled' => '']
])
@endbutton