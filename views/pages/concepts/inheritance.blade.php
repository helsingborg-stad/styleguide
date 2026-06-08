@extends('layout.containers.doc')

@section('doc-content')
    @breadcrumb([
        'classList' => ['u-margin__bottom--3'],
        'list' => [
            ['href' => '/', 'label' => 'Home'],
            ['href' => '/concepts', 'label' => 'Concepts'],
            ['label' => 'Inheritance'],
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
                'description' => 'Field background color is resolved with an explicit CSS variable chain. Because the inherit hook is read on the rendered field surface, this example targets the field instance itself. The inherited case uses the secondary color, while the second field keeps the same inherited context but overrides the component background with a different value.',
        'color' => 'default',
        'attributeList' => [
<style>
    .field-demo--inherited .c-field {
        --c-field--contrast-color: var(--color--secondary-contrast);
    }

    .field-demo--inherited .c-field__inner {
        --inherit-color-background: var(--color--secondary);
    }

    .field-demo--explicit .c-field {
        --c-field--contrast-color: var(--color--primary);
    }

    .field-demo--explicit .c-field__inner {
        --inherit-color-background: var(--color--secondary);
        --c-field--background-color: var(--color--primary-contrast);
    }
</style>

<div class="field-demo--inherited">
    @field([
        'label' => 'Inherited field background',
        'name' => 'inheritance-field-default',
        'type' => 'text',
        'placeholder' => 'Reads the inherited secondary background',
    ])
    @endfield
</div>

<div class="field-demo--explicit">
    @field([
        'label' => 'Explicit field override',
        'name' => 'inheritance-field-explicit',
        'type' => 'text',
        'placeholder' => 'Uses the explicit component background',
    ])
    @endfield
</div>
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
                'title' => 'Accordion content scales nested titles',
                'description' => 'The accordion content area can publish compressed typography variables on the built-in type scale, so dense content panels keep nested headings between the body-size floor and the accordion label scale without using a separate multiplier or cap.',
                'previewView' => 'pages.partials.concepts.inheritance.accordion-typography-preview',
                'bladeCode' => <<<'BLADE'
@accordion([])
    @accordion__item([
        'heading' => 'No correction',
    ])
        <div style="--c-typography--h1-font-size: var(--c-typography--h1-font-size-default); --c-typography--h2-font-size: var(--c-typography--h2-font-size-default); --c-typography--h3-font-size: var(--c-typography--h3-font-size-default); --c-typography--h4-font-size: var(--c-typography--h4-font-size-default); --c-typography--h5-font-size: var(--c-typography--h5-font-size-default); --c-typography--h6-font-size: var(--c-typography--h6-font-size-default);">
            @typography(['element' => 'h2', 'variant' => 'h2', 'classList' => ['u-margin__bottom--1']])
                Uncorrected content title
            @endtypography

            @typography(['element' => 'p', 'variant' => 'body'])
                This panel resets the accordion typography variables, so nested titles keep their original scale.
            @endtypography
        </div>
    @endaccordion__item

    @accordion__item([
        'heading' => 'Corrected',
    ])
        <div>
            @typography(['element' => 'h2', 'variant' => 'h2', 'classList' => ['u-margin__bottom--1']])
                Corrected content title
            @endtypography

            @typography(['element' => 'p', 'variant' => 'body'])
                This panel uses the accordion defaults, which reduce nested titles on the built-in type scale without any extra cap variable.
            @endtypography
        </div>
    @endaccordion__item
@endaccordion
BLADE,
                'implementationCode' => <<<'SCSS'
.c-accordion__content {
    --c-typography--h1-font-size: calc(var(--font-size-base) * pow(var(--font-size-scale-ratio), 0.8333333333));
    --c-typography--h2-font-size: calc(var(--font-size-base) * pow(var(--font-size-scale-ratio), 0.6666666667));
    --c-typography--h3-font-size: calc(var(--font-size-base) * pow(var(--font-size-scale-ratio), 0.5));
    --c-typography--h4-font-size: calc(var(--font-size-base) * pow(var(--font-size-scale-ratio), 0.3333333333));
    --c-typography--h5-font-size: calc(var(--font-size-base) * pow(var(--font-size-scale-ratio), 0.1666666667));
    --c-typography--h6-font-size: var(--font-size-base);
}
SCSS,
                'implementationLanguage' => 'scss',
            ],
            [
                'title' => 'Field explicit-var-first chain',
                'description' => 'Field background color is resolved with an explicit CSS variable chain. In this example the inherited case uses the secondary color, while the second field keeps the same inherited context but overrides the component background with a different value.',
                'previewView' => 'pages.partials.concepts.inheritance.field-preview',
                'bladeCode' => <<<'BLADE'
<div style="--inherit-color-background: var(--color--secondary); --c-field--contrast-color: var(--color--secondary-contrast);">
    @field([
        'label' => 'Inherited field background',
        'name' => 'inheritance-field-default',
        'type' => 'text',
        'placeholder' => 'Reads the inherited secondary background',
    ])
    @endfield
</div>

<div style="--inherit-color-background: var(--color--secondary); --c-field--background-color: var(--color--primary-contrast); --c-field--contrast-color: var(--color--primary);">
    @field([
        'label' => 'Explicit field override',
        'name' => 'inheritance-field-explicit',
        'type' => 'text',
        'placeholder' => 'Uses the explicit component background',
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

    @typography(['element' => 'h1', 'variant' => 'h1', 'classList' => ['u-margin__bottom--2']])
        Inheritance
    @endtypography

    @typography(['element' => 'p', 'variant' => 'body'])
        Examples showing where inherit hooks participate in runtime styling, and how explicit component values now take precedence over inherited fallbacks.
    @endtypography

    @divider(['size' => 'full', 'classList' => ['u-margin__top--6', 'u-margin__bottom--6']])
    @enddivider

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
