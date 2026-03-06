@extends('layout.containers.doc')

@section('doc-content')
    @breadcrumb([
        'classList' => ['u-margin__bottom--3'],
        'list' => [
            ['href' => '/', 'label' => 'Home'],
            ['href' => '/components', 'label' => 'Components'],
            ['label' => $headline ?? 'Component']
        ]
    ])
    @endbreadcrumb

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

    <!-- Render component example and source code tabs -->
    @if(!empty($examples ?? []))
        @foreach($examples as $example)
            @if(!empty($example['description']['heading']) || !empty($example['description']['description']))
                <article class="u-margin__bottom--2 u-margin__top--10">
                    @if(!empty($example['description']['heading']))
                        @typography(['variant' => 'h3', 'element' => 'h3'])
                            {{ $example['description']['heading'] }}
                        @endtypography
                    @endif

                    @if(!empty($example['description']['description']))
                        @typography(['variant' => 'body', 'element' => 'p'])
                            {{ $example['description']['description'] }}
                        @endtypography
                    @endif
                </article>
            @endif

            @paper(['padding' => 0, 'classList' => ['u-margin__bottom--4']])
                @php
                    $htmlSourceCode = e(\HbgStyleGuide\Helper\ParseString::tidyHtml($example['html']['code']));
                    $bladeSourceCode = e($example['blade']['code']);

                    $renderView = static function (string $viewPath, array $viewData = []) use ($__env): string {
                        return $__env->make($viewPath, $viewData)->render();
                    };

                    $exampleTabContent   = $__env->make($example['component'], get_defined_vars())->render();
                    $htmlCodeTemplate    = $renderView('layout.partials.doc.tab-code', ['language' => 'html']);
                    $htmlCodeTabContent  = str_replace('__CODE_PLACEHOLDER__', $htmlSourceCode, $htmlCodeTemplate);
                    $bladeCodeTemplate   = $renderView('layout.partials.doc.tab-code', ['language' => 'php']);
                    $bladeCodeTabContent = str_replace('__CODE_PLACEHOLDER__', $bladeSourceCode, $bladeCodeTemplate);
                @endphp

                @tabs(['tabs' => [
                    ['title' => 'Example', 'content' => $exampleTabContent],
                    ['title' => 'HTML',    'content' => $htmlCodeTabContent],
                    ['title' => 'Blade',   'content' => $bladeCodeTabContent],
                ]])
                @endtabs
            @endpaper
        @endforeach
    @else
        @notice([
            'type' => 'warning',
            'message' => ['text' => 'No component examples available.']
        ])
        @endnotice
    @endif

@stop
