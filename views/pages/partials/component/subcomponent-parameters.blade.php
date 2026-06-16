@if(!empty($subcomponent['parameters']))
    @table([
        'headings' => ['Parameter', 'Default', 'Type', 'Purpose'],
        'includePaper' => false,
        'list'     => array_map(static fn(array $row): array => [
            'columns' => [$row['parameter'], $row['default'], $row['type'], $row['description']],
        ], $subcomponent['parameters']),
    ])
    @endtable
@endif