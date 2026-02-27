<div style="display: flex; gap: 16px; paddig: 16px; background: url('https://www.w3schools.com/w3css/img_lights.jpg') center / cover; padding: 16px;">
    @datebadge([
        'date' => date("Y-m-d"),
        'translucent' => true
    ])
    @enddatebadge
    @datebadge([
        'date' => date("Y-m-d"),
        'color' => 'primary',
        'translucent' => true
    ])
    @enddatebadge
    @datebadge([
        'date' => date("Y-m-d"),
        'color' => 'secondary',
        'translucent' => true
    ])
    @enddatebadge
</div>