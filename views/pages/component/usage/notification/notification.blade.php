@button(['type' => 'filled', 'text' => 'Get notification', 'color' => 'primary', 'classList' => ['notification__button']])
@endbutton


@notification(
    [
        'type' => 'danger',
        'message' => ['text' => 'This is a warning', 'size' => 'md'],
        'icon' => ['name' => 'warning', 'size' => 'md', 'color' => 'white'],
        'animation' => ['onPageLoad' => false, 'direction' => 'bottom-left'],
        'autoHideDuration' => '10000',
        'maxAmount' => '3'
    ]
)
@endnotification
