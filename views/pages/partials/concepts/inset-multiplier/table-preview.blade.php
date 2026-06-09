@table([
    'title' => 'Inset-aware table',
    'headings' => ['Service', 'Owner', 'Status', 'Updated'],
    'list' => [
        ['columns' => ['Cards', 'UX team', 'Stable', 'Today']],
        ['columns' => ['Tables', 'Platform', 'Pilot', 'Yesterday']],
        ['columns' => ['Forms', 'Core', 'Stable', 'Today']],
    ],
])
@endtable

@typography(['variant' => 'meta'])
    Resize the preview to see the table raise its own local inset scale from the container query.
@endtypography