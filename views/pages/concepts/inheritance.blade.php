@extends('layout.containers.doc')

@section('doc-hero')
    @include('layout.partials.doc-hero', [
        'title' => 'Inheritance',
        'subtitle' => 'Examples showing where inherit hooks participate in runtime styling, and how explicit component values now take precedence over inherited fallbacks.',
        'metaTags' => [
            ['label' => 'Concepts'],
            ['label' => 'Precedence examples'],
        ],
        'primaryCta' => ['label' => 'Browse button docs', 'href' => '/components/button'],
        'secondaryCta' => ['label' => 'View typography docs', 'href' => '/components/typography'],
        'shortcuts' => [
            ['label' => 'Button', 'href' => '/components/button'],
            ['label' => 'Typography', 'href' => '/components/typography'],
            ['label' => 'Field', 'href' => '/components/field'],
            ['label' => 'Timeline', 'href' => '/components/timeline'],
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

        $examples = [
            [
                'title' => 'Button token inheritance',
                'description' => 'The container publishes inherit hooks for surface and contrast. The first button consumes those values. The second button sets explicit component variables, so its customization wins over the inherited values.',
                'previewView' => 'pages.partials.concepts.inheritance.button-preview',
                'bladeCode' => <<<'BLADE'
<div style="--inherit-color-background: var(--color--primary); --inherit-color-contrast: var(--color--primary-contrast); --inherit-color-background-hover: var(--color--primary-border); --inherit-color-background-active: var(--color--primary-alt);">
    @button(['text' => 'Inherited default button', 'style' => 'filled', 'color' => 'default'])
    @endbutton

    @button([
        'text' => 'Explicit override wins',
        'style' => 'filled',
        'color' => 'default',
        'attributeList' => [
            'style' => '--c-button--color--surface-alt: var(--color--secondary); --c-button--color--surface-contrast: var(--color--secondary-contrast); --c-button--color--surface-border: var(--color--secondary-border);',
        ],
    ])
    @endbutton
</div>
BLADE,
                'implementationCode' => <<<'SCSS'
background-color: tokens.getRawValue(
    $prefix: $_,
    $token: 'color--surface-alt',
    $inheritVariable: 'color-background'
);

color: tokens.getRawValue(
    $prefix: $_,
    $token: 'color--surface-contrast',
    $inheritVariable: 'color-contrast'
);
SCSS,
                'implementationLanguage' => 'scss',
            ],
            [
                'title' => 'Typography derived aliases',
                'description' => 'Typography variants such as lead text use derived aliases rather than direct token variables. The first example uses the inherited font size. The second sets the alias directly, which takes precedence.',
                'previewView' => 'pages.partials.concepts.inheritance.typography-preview',
                'bladeCode' => <<<'BLADE'
<div style="--inherit-font-size: var(--font-size-500);">
    <p class="c-typography__variant--lead">Inherited lead size from container</p>
    <p class="c-typography__variant--lead" style="--c-typography--font-size-lead: var(--font-size-200);">
        Explicit lead alias override
    </p>
</div>
BLADE,
                'implementationCode' => <<<'SCSS'
font-size: tokens.getDerivedAliasValue(
    $prefix: $_,
    $variable: 'font-size-lead',
    $inheritVariable: 'font-size'
);
SCSS,
                'implementationLanguage' => 'scss',
            ],
            [
                'title' => 'Field explicit-var-first chain',
                'description' => 'Field background color is resolved with an explicit CSS variable chain. The container can still influence the component through the inherit hook, but a component-level variable remains the first choice.',
                'previewView' => 'pages.partials.concepts.inheritance.field-preview',
                'bladeCode' => <<<'BLADE'
<div style="--inherit-color-background: var(--color--primary-contrast);">
    @field([
        'label' => 'Inherited field background',
        'name' => 'inheritance-field-default',
        'type' => 'text',
        'placeholder' => 'Reads the inherited background',
    ])
    @endfield

    @field([
        'label' => 'Explicit field override',
        'name' => 'inheritance-field-explicit',
        'type' => 'text',
        'placeholder' => 'Uses the component override',
        'attributeList' => [
            'style' => '--c-field--background-color: var(--color--surface);',
        ],
    ])
    @endfield
</div>
BLADE,
                'implementationCode' => <<<'CSS'
background: var(
    --#{$_}--background-color,
    var(--inherit-color-background, var(--#{$_}--background-color-default))
);
CSS,
                'implementationLanguage' => 'css',
            ],
        ];

        $implementationTabs = [
            [
                'title' => 'Token helper',
                'content' => $buildCodeTabContent('scss', <<<'SCSS'
background-color: tokens.getRawValue(
    $prefix: $_,
    $token: 'color--surface',
    $inheritVariable: 'color-background'
);
SCSS),
            ],
            [
                'title' => 'Derived alias',
                'content' => $buildCodeTabContent('scss', <<<'SCSS'
font-size: tokens.getDerivedAliasValue(
    $prefix: $_,
    $variable: 'font-size-lead',
    $inheritVariable: 'font-size'
);
SCSS),
            ],
            [
                'title' => 'Explicit CSS chain',
                'content' => $buildCodeTabContent('css', <<<'CSS'
background: var(
    --#{$_}--background-color,
    var(--inherit-color-background, var(--#{$_}--background-color-default))
);
CSS),
            ],
        ];
    @endphp

    @typography(['element' => 'h1', 'variant' => 'h1', 'classList' => ['u-margin__bottom--1']])
        Inheritance
    @endtypography

    @typography(['element' => 'p', 'variant' => 'body', 'classList' => ['u-margin__bottom--4']])
        These examples demonstrate the same precedence chain now used across the affected components: explicit component override first, then inherit hook, then default token or derived alias fallback.
    @endtypography

    @notice([
        'type' => 'info',
        'message' => [
            'text' => 'Each example is split into tabs so you can inspect the live preview, the Blade usage, and the implementation pattern that resolves the precedence.',
        ],
        'classList' => ['u-margin__bottom--4'],
    ])
    @endnotice

    @paper(['padding' => 4, 'classList' => ['u-margin__bottom--5']])
        @typography(['element' => 'h2', 'variant' => 'h2', 'classList' => ['u-margin__bottom--2']])
            Resolution order
        @endtypography

        @listing([
            'list' => [
                ['label' => '1. Check whether the component instance sets its own custom property such as `--c-button--*`, `--c-field--*`, or a derived alias like `--c-typography--font-size-lead`.'],
                ['label' => '2. If no explicit component value exists, consume the matching `--inherit-*` variable from the surrounding context.'],
                ['label' => '3. If neither exists, fall back to the token-backed `-default` variable or token helper result.'],
            ],
            'elementType' => 'ul',
        ])
        @endlisting
    @endpaper

    @typography(['element' => 'h2', 'variant' => 'h2', 'classList' => ['u-margin__bottom--2']])
        Live examples
    @endtypography

    @foreach($examples as $example)
        <article class="u-margin__bottom--2 u-margin__top--6">
            @typography(['element' => 'h3', 'variant' => 'h3', 'classList' => ['u-margin__bottom--1']])
                {{ $example['title'] }}
            @endtypography

            @typography(['element' => 'p', 'variant' => 'body'])
                {{ $example['description'] }}
            @endtypography
        </article>

        @paper(['padding' => 0, 'classList' => ['u-margin__bottom--5']])
            @php
                $previewTabContent = '<div class="markup-preview">' . $renderView($example['previewView']) . '</div>';

                $tabs = [
                    [
                        'title' => 'Preview',
                        'content' => $previewTabContent,
                    ],
                    [
                        'title' => 'Blade usage',
                        'content' => $buildCodeTabContent('php', $example['bladeCode']),
                    ],
                    [
                        'title' => 'Implementation',
                        'content' => $buildCodeTabContent($example['implementationLanguage'], $example['implementationCode']),
                    ],
                ];
            @endphp

            @tabs([
                'tabs' => $tabs,
            ])
            @endtabs
        @endpaper
    @endforeach

    @typography(['element' => 'h2', 'variant' => 'h2', 'classList' => ['u-margin__bottom--2']])
        Implementation patterns
    @endtypography

    @typography(['element' => 'p', 'variant' => 'body', 'classList' => ['u-margin__bottom--3']])
        Use the helper that matches the type of value you are resolving. Direct token-backed component variables use token helpers, derived aliases use the alias helper, and non-token runtime variables can keep an explicit CSS fallback chain.
    @endtypography

    @paper(['padding' => 0, 'classList' => ['u-margin__bottom--4']])
        @tabs([
            'tabs' => $implementationTabs,
        ])
        @endtabs
    @endpaper
@stop