@extends('layout.containers.doc')

@section('doc-content')
    @breadcrumb([
        'classList' => ['u-margin__bottom--3'],
        'list' => [
            ['href' => '/', 'label' => 'Home'],
            ['href' => '/elements', 'label' => 'Elements'],
            ['label' => $headline ?? 'Element']
        ]
    ])
    @endbreadcrumb

    @typography([
        'element' => 'h1',
        'variant' => 'h1',
        'classList' => ['u-display--flex', 'u-align-items--center', 'u-gap--2', 'u-margin__bottom--2']
    ])
        @icon([
            'icon' => $componentIcon ?? 'code_blocks',
            'attributeList' => [
                'style' => 'line-height: 1;'
            ],
        ])
        @endicon

        {{ $headline ?? 'Element' }}
    @endtypography

    @if(isset($description) && !empty($description))
        @typography(['element' => 'p', 'variant' => 'body'])
            {{ $description }}
        @endtypography

        @divider(['size' => 'full', 'classList' => ['u-margin__top--6', 'u-margin__bottom--6']])
        @enddivider
    @endif

    @doc(['viewDoc' => $viewDoc ?? []])
    @enddoc
@stop
