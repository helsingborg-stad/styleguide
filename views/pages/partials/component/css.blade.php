@if(!empty($cssParameters ?? []))
    @divider(['size' => 'full', 'classList' => ['u-margin__top--6', 'u-margin__bottom--6']])
    @enddivider

    @typography(['variant' => 'h2', 'element' => 'h2', 'classList' => ['u-margin__bottom--4']])
        CSS API
    @endtypography

    @table([
        'headings' => ['Variable', 'Default', 'Type', 'Values', 'Description'],
        'list'     => array_map(static fn(array $row): array => [
            'columns' => [$row['key'], $row['defaultValue'], $row['type'], $row['availableValues'], $row['description']],
        ], $cssParameters),
    ])
    @endtable
@endif
