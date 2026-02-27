<div style="display: flex; gap: 16px;">
    @datebadge([
        'date' => date("Y-m-d")
    ])
    @enddatebadge
    @datebadge([
        'date' => date("Y-m-d"),
        'color' => 'primary',
    ])
    @enddatebadge
    @datebadge([
        'date' => date("Y-m-d"),
        'color' => 'secondary',
    ])
    @enddatebadge
</div>