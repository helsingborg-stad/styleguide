@extends('layout.containers.doc')

@section('doc-content')
    @breadcrumb([
        'classList' => ['u-margin__bottom--3'],
        'list' => [
            ['href' => '/', 'label' => 'Home'],
            ['href' => '/concepts', 'label' => 'Concepts'],
            ['label' => 'Local customization'],
        ]
    ])
    @endbreadcrumb

    @php
        $renderView = static function (string $viewPath, array $viewData = []) use ($__env): string {
            return $__env->make($viewPath, $viewData)->render();
        };

        $buildCodeTabContent = static function (string $language, string $code) use ($renderView): string {
            $template = $renderView('layout.partials.doc.tab-code', ['language' => $language]);

            return str_replace('__CODE_PLACEHOLDER__', e($code), $template);
        };

        $exampleTabs = [
            [
                'title' => 'Preview',
                'content' => '<div class="markup-preview">' . $renderView('pages.partials.concepts.local-customization.segment-button-preview') . '</div>',
            ]
        ];
    @endphp

    @typography(['element' => 'h1', 'variant' => 'h1', 'classList' => ['u-margin__bottom--2']])
        Local Customization
    @endtypography

    @typography(['element' => 'p', 'variant' => 'body'])
        This concept demonstrates a single local scope inside a full-width view. The section still provides the inherited button contrast, but the scope wrapper defines the exact area that Design Builder should customize for all buttons in that scoped group.
    @endtypography

    @divider(['size' => 'full', 'classList' => ['u-margin__top--6', 'u-margin__bottom--6']])
    @enddivider

    <article class="u-margin__bottom--2 u-margin__top--6">
        @typography(['element' => 'h2', 'variant' => 'h2', 'classList' => ['u-margin__bottom--1']])
            Full-width section example
        @endtypography

        @typography(['element' => 'p', 'variant' => 'body'])
            This example uses the real rendered primary, secondary, and default button variants inside one shared scope. They inherit a reasonable contrast from the full-width section, and the scope wrapper marks that full-view context for Design Builder. You may customize the buttons in this section by targeting the <code>campaign-hero</code> scope in Design Builder, and the changes will apply to all buttons inside that scope while ensuring that colorschemes is aopplies correctly (incl. contrast colors, border color and hover state).
        @endtypography
    </article>

    @paper(['padding' => 0, 'classList' => ['u-margin__bottom--5']])
        @tabs([
            'tabs' => $exampleTabs,
        ])
        @endtabs
    @endpaper
@stop