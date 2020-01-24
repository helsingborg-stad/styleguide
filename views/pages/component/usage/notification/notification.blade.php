@button(['type' => 'filled', 'text' => 'Get notification', 'color' => 'primary', 'classList' => ['notification__button']])
@endbutton


@notification(
    [
        'type' => 'danger',
        'message' => ['text' => 'This is a warning', 'size' => 'md'],
        'icon' => ['name' => 'warning', 'size' => 'md', 'color' => 'black'],
        'animation' => ['onPageLoad' => true, 'direction' => 'bottom-left'],
        'classList' => ['u-display--none']
    ]
)
@endnotification
