@grid([
    "container" => true,
    "col_gap" => 8,
    "row_gap" => 3
])
    @grid([
        "col" => [
            "xs" => [1,7],
            "sm" => [1,7],
            "md" => [1,7],
            "lg" => [1,7],
            "xl" => [1,7]
        ],
        "row" => [
            "xs" => [1,2],
            "sm" => [1,2],
            "md" => [1,2],
            "lg" => [1,2],
            "xl" => [1,2]
        ],
        "classList" => [
            "u-color__bg--primary",
            "u-rounded"
        ]
    ])
        Grid Item
    @endgrid

    @grid([
        "col" => [
            "xs" => [7,13],
            "sm" => [7,13],
            "md" => [7,13],
            "lg" => [7,13],
            "xl" => [7,13]
        ],
        "row" => [
            "xs" => [1,2],
            "sm" => [1,2],
            "md" => [1,2],
            "lg" => [1,2],
            "xl" => [1,2]
        ],
        "classList" => [
            "u-color__bg--secondary",
            "u-rounded"
        ]
    ])
        Grid Item
    @endgrid

    @grid([
        "col" => [
            "xs" => [1,13],
            "sm" => [1,13],
            "md" => [1,13],
            "lg" => [1,13],
            "xl" => [1,13]
        ],
        "row" => [
            "xs" => [2,4],
            "sm" => [2,4],
            "md" => [2,4],
            "lg" => [2,4],
            "xl" => [2,4]
        ],
        "classList" => [
            "u-color__bg--info",
            "u-rounded"
        ]
    ])
        Grid Item
    @endgrid
@endgrid