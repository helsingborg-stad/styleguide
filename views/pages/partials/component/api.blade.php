@if(!empty($api ?? []))
    @divider(['size' => 'full', 'classList' => ['u-margin__top--6', 'u-margin__bottom--6']])
    @enddivider

    @typography(['variant' => 'h2', 'element' => 'h2', 'classList' => ['u-margin__bottom--4']])
        API
    @endtypography

    @table([
        'headings' => ['Parameter', 'Default', 'Description'],
        'list'     => array_map(static fn(array $row): array => [
            'columns' => [$row['parameter'], $row['default'], $row['description']],
        ], $api),
    ])
    @endtable
@endif
