@calendar(
    [
        'color' => 'secondary',
        'size' => 'large',
        'get' => [
            'available' => '/assets/data/availableDummyData.json',
            'booked' => '/assets/data/bookedDummyData.json'
        ],
        'post' => ''
    ]
)
@endcalendar