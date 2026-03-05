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
            @utility_doc([
                'viewDoc' => [
                    'type' => 'utility',
                    'root' => $slug,
                    'config' => $utilityEntryKey
                ]
            ])
                @foreach(($utilityExamplesByEntry[$utilityEntryKey] ?? []) as $utilityExampleView)
                    @php
                        $utilityExampleViewName = is_array($utilityExampleView)
                            ? (string) ($utilityExampleView['view'] ?? '')
                            : (string) $utilityExampleView;

                        $utilityExampleTitle = is_array($utilityExampleView)
                            && isset($utilityExampleView['title'])
                            && is_string($utilityExampleView['title'])
                            ? trim($utilityExampleView['title'])
                            : '';

                        $utilityExampleDescription = is_array($utilityExampleView)
                            && isset($utilityExampleView['description'])
                            && is_string($utilityExampleView['description'])
                            ? trim($utilityExampleView['description'])
                            : '';

                        $utilityExampleCssUrls = is_array($utilityExampleView)
                            && isset($utilityExampleView['css'])
                            && is_array($utilityExampleView['css'])
                            ? $utilityExampleView['css']
                            : [];
                    @endphp

                    @if($utilityExampleTitle !== '')
                        @typography([
                            'element' => 'h3',
                            'variant' => 'h4',
                            'classList' => ['u-margin__bottom--1']
                        ])
                            {{ $utilityExampleTitle }}
                        @endtypography
                    @endif

                    @if($utilityExampleDescription !== '')
                        @typography([
                            'element' => 'p',
                            'variant' => 'body',
                            'classList' => ['u-margin__bottom--2']
                        ])
                            {{ $utilityExampleDescription }}
                        @endtypography
                    @endif

                    <!-- Load specific example css -->
                    @foreach($utilityExampleCssUrls as $utilityExampleCssUrl)
                        @if(is_string($utilityExampleCssUrl) && trim($utilityExampleCssUrl) !== '')
                            <link rel="stylesheet" href="{{ $utilityExampleCssUrl }}">
                        @endif
                    @endforeach

                    @if($utilityExampleViewName !== '')
                        @include($utilityExampleViewName)
                    @endif
                @endforeach
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
