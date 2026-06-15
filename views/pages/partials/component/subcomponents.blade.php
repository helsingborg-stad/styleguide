@if(!empty($subcomponents ?? []))
    @divider(['size' => 'full', 'classList' => ['u-margin__top--6', 'u-margin__bottom--6']])
    @enddivider

    @typography(['variant' => 'h2', 'element' => 'h2', 'classList' => ['u-margin__bottom--2']])
        Subcomponents
    @endtypography

    @typography(['variant' => 'meta', 'element' => 'p', 'classList' => ['u-margin__bottom--3']])
        Child components for {{ $slug ?? 'this component' }}, including purpose and supported Blade parameters.
    @endtypography

    @foreach($subcomponents as $subcomponent)
        <section class="u-margin__bottom--4">
            @if(!$loop->first)
                @divider(['size' => 'full', 'classList' => ['u-margin__top--3', 'u-margin__bottom--3']])
                @enddivider
            @endif

            @typography([
                'variant' => 'h4',
                'element' => 'h3',
                'classList' => ['u-margin__bottom--1'],
                'attributeList' => [
                    'id' => $subcomponent['anchor'] ?? '',
                ],
            ])
                {{ $subcomponent['name'] ?? '' }}
            @endtypography

            @if(!empty($subcomponent['purpose']))
                @typography(['variant' => 'body', 'element' => 'p', 'classList' => ['u-margin__bottom--2']])
                    {{ $subcomponent['purpose'] }}
                @endtypography
            @endif

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
        </section>
    @endforeach
@endif