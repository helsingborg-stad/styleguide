<div style="width: 18rem; max-width: 100%; resize: horizontal; overflow: auto; border: 1px dashed var(--color--surface-border); padding: 1rem;">
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
</div>

@typography(['variant' => 'meta'])
    Resize the wrapper to see the table raise its own local inset scale from the container query.
@endtypography