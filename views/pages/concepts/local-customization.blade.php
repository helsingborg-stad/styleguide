@extends('layout.containers.doc')

@section('doc-hero')
    @include('layout.partials.doc-hero', [
        'title' => 'Local Customization',
        'subtitle' => 'A full-width view can define one local scope for the design tool, so a rendered set of buttons can be customized together in that context without affecting buttons elsewhere.',
        'metaTags' => [
            ['label' => 'Concepts'],
            ['label' => 'Scoped customization'],
        ],
        'primaryCta' => ['label' => 'Open button docs', 'href' => '/components/button'],
        'secondaryCta' => ['label' => 'Browse inheritance examples', 'href' => '/concepts/inheritance'],
        'shortcuts' => [
            ['label' => 'Inheritance', 'href' => '/concepts/inheritance'],
            ['label' => 'Button', 'href' => '/components/button'],
            ['label' => 'Scope', 'href' => '/components/scope'],
            ['label' => 'Segment', 'href' => '/components/segment'],
        ],
    ])
@endsection

@section('doc-content')
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
            ],
            [
                'title' => 'Blade usage',
                'content' => $buildCodeTabContent('php', <<<'BLADE'
<section class="c-segment c-segment--full-width c-segment--text-light c-segment--alignment-left c-segment--has-overlay local-customization-demo">
    <div class="c-segment__image"></div>

    <div class="o-container o-container--content c-segment__content">
        <div class="c-segment__padder">
            @typography(['element' => 'h2', 'variant' => 'h2', 'classList' => ['c-segment__title']])
                Forced context with one local opt-out
            @endtypography

            @typography(['element' => 'p', 'variant' => 'body', 'classList' => ['c-segment__text']])
                The view defines one scope around a rendered set of buttons. Design Builder can then target that scope without changing buttons outside this full-width context.
            @endtypography

            <div class="c-segment__buttons">
                @scope(['name' => 'campaign-hero'])
                    @button(['text' => 'Primary', 'style' => 'filled', 'color' => 'primary'])
                    @endbutton
                    @button(['text' => 'Secondary', 'style' => 'filled', 'color' => 'secondary'])
                    @endbutton
                    @button(['text' => 'Default', 'style' => 'filled', 'color' => 'default'])
                    @endbutton
                @endscope
            </div>
        </div>
    </div>
</section>
BLADE),
            ],
            [
                'title' => 'Inherited context',
                'content' => $buildCodeTabContent('scss', <<<'SCSS'
.c-segment.c-segment--text-light .c-button {
    --inherit-color-background: #fff;
    --inherit-color-contrast: #000;
}
SCSS),
            ],
            [
                'title' => 'Design tool scope',
                'content' => $buildCodeTabContent('html', <<<'HTML'
<a class="c-button ..." data-scope="s-campaign-hero;">Primary</a>
<a class="c-button ..." data-scope="s-campaign-hero;">Secondary</a>
<a class="c-button ..." data-scope="s-campaign-hero;">Default</a>
HTML),
            ],
        ];
    @endphp

    @typography(['element' => 'h1', 'variant' => 'h1', 'classList' => ['u-margin__bottom--1']])
        Local Customization
    @endtypography

    @typography(['element' => 'p', 'variant' => 'body', 'classList' => ['u-margin__bottom--4']])
        This concept demonstrates a single local scope inside a full-width view. The section still provides the inherited button contrast, but the scope wrapper defines the exact area that Design Builder should customize for all buttons in that scoped group.
    @endtypography

    @paper(['padding' => 4, 'classList' => ['u-margin__bottom--5']])
        @typography(['element' => 'h2', 'variant' => 'h2', 'classList' => ['u-margin__bottom--2']])
            One scope
        @endtypography

        @listing([
            'list' => [
                ['label' => 'View context: the full-width section forces inherited button colors that stay readable against the dark surface.'],
                ['label' => 'Local scope: the `@scope` wrapper adds the same `data-scope` attribute to every wrapped button, which gives Design Builder one isolated customization target inside that view.'],
            ],
            'elementType' => 'ul',
        ])
        @endlisting
    @endpaper

    <article class="u-margin__bottom--2 u-margin__top--6">
        @typography(['element' => 'h2', 'variant' => 'h2', 'classList' => ['u-margin__bottom--1']])
            Full-width section example
        @endtypography

        @typography(['element' => 'p', 'variant' => 'body'])
            This example uses the real rendered primary, secondary, and default button variants inside one shared scope. They inherit a reasonable contrast from the full-width section, and the scope wrapper marks that full-view context for Design Builder.
        @endtypography
    </article>

    @paper(['padding' => 0, 'classList' => ['u-margin__bottom--5']])
        @tabs([
            'tabs' => $exampleTabs,
        ])
        @endtabs
    @endpaper

    @notice([
        'type' => 'info',
        'message' => [
            'text' => 'Use this pattern when the page should keep safe inherited defaults, but Design Builder needs one named local scope to customize a rendered group of components only in that full-view context.',
        ],
    ])
    @endnotice
@stop