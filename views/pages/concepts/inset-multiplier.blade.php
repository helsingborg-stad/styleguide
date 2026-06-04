@extends('layout.containers.doc')

@section('doc-content')
    @breadcrumb([
        'classList' => ['u-margin__bottom--3'],
        'list' => [
            ['href' => '/', 'label' => 'Home'],
            ['href' => '/concepts', 'label' => 'Concepts'],
            ['label' => 'Inset multiplier'],
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
                'title' => 'Consume the inherited value directly',
                'description' => 'Use the inherited multiplier when a component only needs to follow the spacing rhythm decided by its parent. The accordion reads the public hook and turns it into its own local inset padding variables.',
                'previewView' => 'pages.partials.concepts.inset-multiplier.accordion-preview',
                'bladeCode' => <<<'BLADE'
<div style="--inherit-inset-multiplier: 1.5; max-width: 32rem; margin-inline: auto;">
    @accordion([
        'list' => [
            [
                'heading' => 'Inherited section spacing',
                'content' => 'This accordion uses the parent inset multiplier to grow its horizontal and vertical padding.',
            ],
            [
                'heading' => 'Same component, larger inset',
                'content' => 'Only the public inherit variable changes. The component keeps its own spacing formulas.',
            ],
        ]
    ])
    @endaccordion
</div>
BLADE,
                'implementationCode' => <<<'SCSS'
.c-accordion {
    --c-accordion--inset-multiplier: var(--inherit-inset-multiplier, 1);
    --c-accordion--inset-padding-x: calc(#{tokens.getCalculatedValue($_, "space", 2)} * var(--c-accordion--inset-multiplier));
    --c-accordion--inset-padding-y: calc(#{tokens.getCalculatedValue($_, "space", 2)} * calc(var(--c-accordion--inset-multiplier) * 0.75));
}
SCSS,
                'implementationLanguage' => 'scss',
            ],
            [
                'title' => 'Let a component scale itself from its container',
                'description' => 'Use a local scale when the component should respond to its own available width. The table keeps inherited spacing when it exists, but can still increase its inset at larger container sizes.',
                'previewView' => 'pages.partials.concepts.inset-multiplier.table-preview',
                'bladeCode' => <<<'BLADE'
<div style="width: 18rem; max-width: 100%; resize: horizontal; overflow: auto; border: 1px dashed var(--color--surface-border); padding: 1rem;">
    @table([
        'title' => 'Inset-aware table',
        'headings' => ['Service', 'Owner', 'Status', 'Updated'],
        'list' => [
            ['columns' => ['Cards', 'UX team', 'Stable', 'Today']],
            ['columns' => ['Tables', 'Platform', 'Pilot', 'Yesterday']],
            ['columns' => ['Forms', 'Core', 'Stable', 'Today']],
        ],
    ])
    @endtable
</div>
BLADE,
                'implementationCode' => <<<'SCSS'
.c-table {
    --c-table--inset-scale: 1;
    --c-table--inset-multiplier: max(var(--inherit-inset-multiplier, 1), var(--c-table--inset-scale));
}

@container (min-width: 350px) {
    .c-table {
        --c-table--inset-scale: 1.5;
    }
}

@container (min-width: 500px) {
    .c-table {
        --c-table--inset-scale: 2;
    }
}
SCSS,
                'implementationLanguage' => 'scss',
            ],
            [
                'title' => 'Publish the same inset rhythm to nested children',
                'description' => 'Use the public inherit variable when a parent component should keep nested components aligned with its own container-aware spacing. The card publishes its resolved multiplier so the nested accordion follows the same inset rhythm.',
                'previewView' => 'pages.partials.concepts.inset-multiplier.card-preview',
                'bladeCode' => <<<'BLADE'
<div style="width: 70%; resize: horizontal; overflow: auto; border: 2px solid currentColor; padding: 1rem;">
    @card([
        'heading' => 'Inset-aware card',
        'content' => 'Resize the container to let the card grow its own inset multiplier and pass that spacing on to the nested accordion.',
    ])
        @accordion([
            'list' => [
                [
                    'heading' => 'Nested child inherits card inset',
                    'content' => 'The child keeps the same spacing rhythm as the card body.',
                ],
            ],
        ])
        @endaccordion
    @endcard
</div>
BLADE,
                'implementationCode' => <<<'SCSS'
.c-card [data-component="accordion"] {
    --inherit-inset-multiplier: var(--c-card--inset-multiplier);
}

.c-card__paint-container {
    @container (min-width: 350px) {
        --inherit-inset-multiplier: 1.5;
        --c-card--inset-multiplier: 1.5;
    }

    @container (min-width: 500px) {
        --inherit-inset-multiplier: 2;
        --c-card--inset-multiplier: 2;
    }
}
SCSS,
                'implementationLanguage' => 'scss',
            ],
        ];

        $implementationTabs = [
            [
                'title' => 'Publish',
                'content' => $buildCodeTabContent('scss', <<<'SCSS'
[data-component="accordion"] {
    --inherit-inset-multiplier: var(--c-card--inset-multiplier);
}
SCSS),
            ],
            [
                'title' => 'Consume',
                'content' => $buildCodeTabContent('scss', <<<'SCSS'
--c-accordion--inset-multiplier: var(--inherit-inset-multiplier, 1);
--c-accordion--inset-padding-x: calc(#{tokens.getCalculatedValue($_, "space", 2)} * var(--c-accordion--inset-multiplier));
SCSS),
            ],
            [
                'title' => 'Combine with local scale',
                'content' => $buildCodeTabContent('scss', <<<'SCSS'
--c-table--inset-scale: 1;
--c-table--inset-multiplier: max(var(--inherit-inset-multiplier, 1), var(--c-table--inset-scale));
SCSS),
            ],
        ];
    @endphp

    @typography(['element' => 'h1', 'variant' => 'h1', 'classList' => ['u-margin__bottom--2']])
        Inset multiplier
    @endtypography

    @typography(['element' => 'p', 'variant' => 'body'])
        <code>--inherit-inset-multiplier</code> is the shared runtime hook for spacing that should grow with context. It lets a parent surface, a container query, or both decide how large inset padding and spacing should feel without hard-coding larger values in every nested component.
    @endtypography

    @divider(['size' => 'full', 'classList' => ['u-margin__top--6', 'u-margin__bottom--6']])
    @enddivider

    @paper(['padding' => 4, 'classList' => ['u-margin__bottom--5']])
        @typography(['element' => 'h2', 'variant' => 'h2', 'classList' => ['u-margin__bottom--2']])
            Why we use it
        @endtypography

        @listing([
            'list' => [
                ['label' => 'Keeps nested surfaces on the same spacing rhythm when a parent grows or shrinks.'],
                ['label' => 'Lets container-aware components increase inset spacing without rewriting each padding rule at every breakpoint.'],
                ['label' => 'Preserves token-based formulas, so only the multiplier changes while the spacing recipe stays consistent.'],
            ],
            'elementType' => 'ul',
        ])
        @endlisting
    @endpaper

    @notice([
        'type' => 'info',
        'message' => [
            'text' => 'Keep the public hook generic: parents publish `--inherit-inset-multiplier`, and each component resolves that into its own local `--c-*-inset-multiplier` variable before calculating padding and gaps.',
        ],
        'classList' => ['u-margin__bottom--4'],
    ])
    @endnotice

    @paper(['padding' => 4, 'classList' => ['u-margin__bottom--5']])
        @typography(['element' => 'h2', 'variant' => 'h2', 'classList' => ['u-margin__bottom--2']])
            Short implementation model
        @endtypography

        @listing([
            'list' => [
                ['label' => '1. Publish a public value from the parent or wrapper with `--inherit-inset-multiplier`.'],
                ['label' => '2. Resolve that value inside the component to a local variable such as `--c-table--inset-multiplier` or `--c-accordion--inset-multiplier`.'],
                ['label' => '3. Calculate padding, gaps, and related spacing from the local multiplier instead of duplicating larger token values.'],
                ['label' => '4. If the component is container-aware, combine the inherited value with a local scale using `max(...)` so it never shrinks below its context.'],
            ],
            'elementType' => 'ul',
        ])
        @endlisting
    @endpaper

    @typography(['element' => 'h2', 'variant' => 'h2', 'classList' => ['u-margin__bottom--2']])
        Examples
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
        Implementation snippets
    @endtypography

    @typography(['element' => 'p', 'variant' => 'body', 'classList' => ['u-margin__bottom--3']])
        These are the three recurring patterns: publish the public hook, consume it into a local component variable, and combine it with a container-aware scale when the component also adapts to its own width.
    @endtypography

    @paper(['padding' => 0, 'classList' => ['u-margin__bottom--4']])
        @tabs([
            'tabs' => $implementationTabs,
        ])
        @endtabs
    @endpaper
@stop