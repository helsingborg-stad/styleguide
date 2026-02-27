@extends('layout.containers.doc')

@section('doc-content')
    @typography([
        'element' => 'h1',
        'variant' => 'h1',
        'classList' => ['u-display--flex', 'u-align-items--center', 'u-gap-2', 'u-margin__bottom--2']
    ])
        @icon([
            'icon' => $componentIcon ?? 'widgets',
            'attributeList' => [
                'style' => 'line-height: 1;'
            ],
        ])
        @endicon

        {{ $headline ?? 'Component' }}
    @endtypography

    @if(isset($description) && !empty($description))
        @typography(['element' => 'p', 'variant' => 'body'])
            {{ $description }}
        @endtypography

        @divider(['size' => 'full', 'classList' => ['u-margin__top--6', 'u-margin__bottom--6']])
        @enddivider
    @endif

    @if(isset($slug) && !empty($slug))
        @doc(['slug' => $slug])
        @enddoc
    @endif
@stop
