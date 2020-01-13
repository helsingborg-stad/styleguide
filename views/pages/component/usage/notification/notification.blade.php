@notification(
    [
        'type' => 'danger',
        'message' => ['text' => 'This is a warning', 'size' => 'md'],
        'icon' => ['name' => 'warning', 'size' => 'md', 'color' => 'black'],
        'animation' => ['onPageLoad' => true, 'direction' => 'left']
    ]
)
@endnotification