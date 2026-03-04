@extends('layout.containers.doc')

@section('doc-content')
    @breadcrumb([
        'classList' => ['u-margin__bottom--3'],
        'list' => [
            ['href' => '/', 'label' => 'Home'],
            ['href' => '/utilities', 'label' => 'Utilities'],
            ['label' => $headline ?? 'Utility']
        ]
    ])
    @endbreadcrumb

    @typography([
        'element' => 'h1',
        'variant' => 'h1',
        'classList' => ['u-display--flex', 'u-align-items--center', 'u-gap-2', 'u-margin__bottom--2']
    ])
        @icon([
            'icon' => $componentIcon ?? 'tune',
            'attributeList' => [
                'style' => 'line-height: 1;'
            ],
        ])
        @endicon

        {{ $headline ?? 'Utility' }}
    @endtypography

    @if(isset($description) && !empty($description))
        @typography(['element' => 'p', 'variant' => 'body'])
            {{ $description }}
        @endtypography

        @divider(['size' => 'full', 'classList' => ['u-margin__top--6', 'u-margin__bottom--6']])
        @enddivider
    @endif

    @if(!empty($utilityEntryKeys ?? []) && !empty($slug ?? ''))
        @foreach(($utilityEntryKeys ?? []) as $utilityEntryKey)
            @typography([
                'element' => 'h2',
                'variant' => 'h2',
                'classList' => ['u-margin__top--6', 'u-margin__bottom--2']
            ])
                {{ ucwords(str_replace(['-', '_'], ' ', (string) $utilityEntryKey)) }}
            @endtypography

            @utility_doc([
                'viewDoc' => [
                    'type' => 'utility',
                    'root' => $slug,
                    'config' => $utilityEntryKey
                ]
            ])
            @endutility_doc
        @endforeach
    @else
        @notice([
            'type' => 'warning',
            'message' => ['text' => 'No utility documentation is available right now.']
        ])
        @endnotice
    @endif
@stop
