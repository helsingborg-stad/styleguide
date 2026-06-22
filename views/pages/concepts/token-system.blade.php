@extends('layout.containers.doc')

@section('doc-content')
    @breadcrumb([
        'classList' => ['u-margin__bottom--3'],
        'list' => [
            ['href' => '/', 'label' => 'Home'],
            ['href' => '/concepts', 'label' => 'Concepts'],
            ['label' => 'Token system'],
        ]
    ])
    @endbreadcrumb

    @php
        $architectureSteps = [
            [
                'title' => 'Define global tokens',
                'path' => 'source/data/design-tokens.json',
                'description' => 'System tokens live in JSON so the source of truth stays explicit, reviewable, and schema-validated.',
            ],
            [
                'title' => 'Generate runtime variables',
                'path' => 'source/sass/setting/_design-tokens.scss',
                'description' => 'The token compiler turns JSON entries into CSS custom properties that are published at the global layer.',
            ],
            [
                'title' => 'Declare allowed component inputs',
                'path' => 'source/components/<component>/component.json',
                'description' => 'Each component must opt in to the tokens it is allowed to consume. Nothing is mapped implicitly.',
            ],
            [
                'title' => 'Map to component scope',
                'path' => 'source/sass/mixin/_tokens.scss',
                'description' => 'The token mixin creates component-local aliases such as --c-card--color--surface from the approved global tokens.',
            ],
            [
                'title' => 'Override safely at runtime',
                'path' => ':root or .c-component',
                'description' => 'Themes change the global token surface, while local instances override component-scoped aliases without forking component Sass.',
            ],
        ];

        $tokenSections = [
            [
                'title' => 'Base',
                'summary' => 'The baseline units everything else scales from.',
                'tokens' => [
                    [
                        'token' => '--base',
                        'purpose' => 'Foundation unit for spacing, size, and radius calculations across the system.',
                        'behavior' => 'Locked system baseline. Defaults to calc(1rem / 2) and is usually changed only indirectly.',
                        'editable' => 'No',
                    ],
                    [
                        'token' => '--base-font-size',
                        'purpose' => 'Root type size that drives the entire font-size scale.',
                        'behavior' => 'Direct token. The computed font-size tokens derive from this value.',
                        'editable' => 'Yes',
                    ],
                ],
            ],
            [
                'title' => 'Layout',
                'summary' => 'Controls the container widths used by the page structure.',
                'tokens' => [
                    [
                        'token' => '--container-width-multiplier',
                        'purpose' => 'Controls the main content width scale.',
                        'behavior' => 'Direct numeric input used to compute the standard container width.',
                        'editable' => 'Yes',
                    ],
                    [
                        'token' => '--container-width',
                        'purpose' => 'Final container width used by layouts.',
                        'behavior' => 'Derived from --container-width-multiplier and --base.',
                        'editable' => 'No',
                    ],
                    [
                        'token' => '--container-width-wide-multiplier',
                        'purpose' => 'Controls how much wider the wide container is than the default container.',
                        'behavior' => 'Direct numeric input applied on top of the standard container width.',
                        'editable' => 'Yes',
                    ],
                    [
                        'token' => '--container-width-wide',
                        'purpose' => 'Final wide-container width token.',
                        'behavior' => 'Derived from --container-width and --container-width-wide-multiplier.',
                        'editable' => 'No',
                    ],
                ],
            ],
            [
                'title' => 'Radius',
                'summary' => 'Defines how rounded corners behave throughout the system.',
                'tokens' => [
                    [
                        'token' => '--border-radius',
                        'purpose' => 'Radius scale input used by components for rounded corners.',
                        'behavior' => 'Direct numeric token that components usually multiply by --base.',
                        'editable' => 'Yes',
                    ],
                    [
                        'token' => '--corner-shape',
                        'purpose' => 'Controls the corner rendering mode where corner-shape is supported.',
                        'behavior' => 'Direct select token, typically switching between corner styles such as round.',
                        'editable' => 'Yes',
                    ],
                ],
            ],
            [
                'title' => 'Typography',
                'summary' => 'Sets the system-level inputs for font families, weights, and rhythm.',
                'tokens' => [
                    [
                        'token' => '--font-family-base',
                        'purpose' => 'Default body font family.',
                        'behavior' => 'Direct font token used by the base text layer.',
                        'editable' => 'Yes',
                    ],
                    [
                        'token' => '--font-family-heading',
                        'purpose' => 'Heading font family.',
                        'behavior' => 'Defaults to the base font family until explicitly changed.',
                        'editable' => 'Yes',
                    ],
                    [
                        'token' => '--font-family-code',
                        'purpose' => 'Monospace stack for code-oriented UI and documentation.',
                        'behavior' => 'Locked direct token with a fixed default stack.',
                        'editable' => 'No',
                    ],
                    [
                        'token' => '--font-size-scale-ratio',
                        'purpose' => 'Ratio used to generate the full font-size scale.',
                        'behavior' => 'Direct stepped range token consumed by the derived font-size tokens.',
                        'editable' => 'Yes',
                    ],
                    [
                        'token' => '--font-weight-normal',
                        'purpose' => 'Default text weight.',
                        'behavior' => 'Direct token for body text emphasis baseline.',
                        'editable' => 'Yes',
                    ],
                    [
                        'token' => '--font-weight-medium',
                        'purpose' => 'Medium emphasis font weight.',
                        'behavior' => 'Direct token for moderate emphasis states.',
                        'editable' => 'Yes',
                    ],
                    [
                        'token' => '--font-weight-bold',
                        'purpose' => 'Strong emphasis font weight.',
                        'behavior' => 'Direct token for bold emphasis.',
                        'editable' => 'Yes',
                    ],
                    [
                        'token' => '--font-weight-heading',
                        'purpose' => 'Default heading weight.',
                        'behavior' => 'Direct token applied to heading styles.',
                        'editable' => 'Yes',
                    ],
                    [
                        'token' => '--line-height-base',
                        'purpose' => 'Default body line height.',
                        'behavior' => 'Direct numeric token for readable body copy rhythm.',
                        'editable' => 'Yes',
                    ],
                    [
                        'token' => '--line-height-heading',
                        'purpose' => 'Default heading line height.',
                        'behavior' => 'Direct numeric token for tighter heading rhythm.',
                        'editable' => 'Yes',
                    ],
                    [
                        'token' => '--letter-spacing-base',
                        'purpose' => 'Default text letter spacing.',
                        'behavior' => 'Direct numeric token for overall body text tracking.',
                        'editable' => 'Yes',
                    ],
                ],
            ],
            [
                'title' => 'Derived font sizes',
                'summary' => 'Computed size tokens generated from the type baseline and scale ratio.',
                'tokens' => [
                    [
                        'token' => '--font-size-80',
                        'purpose' => 'Two steps below the base type size.',
                        'behavior' => 'Derived from --base-font-size and --font-size-scale-ratio.',
                        'editable' => 'No',
                    ],
                    [
                        'token' => '--font-size-90',
                        'purpose' => 'One step below the base type size.',
                        'behavior' => 'Derived from --base-font-size and --font-size-scale-ratio.',
                        'editable' => 'No',
                    ],
                    [
                        'token' => '--font-size-100',
                        'purpose' => 'Base type size token.',
                        'behavior' => 'Derived directly from --base-font-size.',
                        'editable' => 'No',
                    ],
                    [
                        'token' => '--font-size-200',
                        'purpose' => 'One step above the base type size.',
                        'behavior' => 'Derived from --base-font-size and --font-size-scale-ratio.',
                        'editable' => 'No',
                    ],
                    [
                        'token' => '--font-size-300',
                        'purpose' => 'Two steps above the base type size.',
                        'behavior' => 'Derived from --base-font-size and --font-size-scale-ratio.',
                        'editable' => 'No',
                    ],
                    [
                        'token' => '--font-size-400',
                        'purpose' => 'Three steps above the base type size.',
                        'behavior' => 'Derived from --base-font-size and --font-size-scale-ratio.',
                        'editable' => 'No',
                    ],
                    [
                        'token' => '--font-size-500',
                        'purpose' => 'Four steps above the base type size.',
                        'behavior' => 'Derived from --base-font-size and --font-size-scale-ratio.',
                        'editable' => 'No',
                    ],
                    [
                        'token' => '--font-size-600',
                        'purpose' => 'Five steps above the base type size.',
                        'behavior' => 'Derived from --base-font-size and --font-size-scale-ratio.',
                        'editable' => 'No',
                    ],
                    [
                        'token' => '--font-size-700',
                        'purpose' => 'Six steps above the base type size.',
                        'behavior' => 'Derived from --base-font-size and --font-size-scale-ratio.',
                        'editable' => 'No',
                    ],
                    [
                        'token' => '--font-size-800',
                        'purpose' => 'Seven steps above the base type size.',
                        'behavior' => 'Derived from --base-font-size and --font-size-scale-ratio.',
                        'editable' => 'No',
                    ],
                ],
            ],
            [
                'title' => 'Borders',
                'summary' => 'Controls line weight and companion-border generation.',
                'tokens' => [
                    [
                        'token' => '--border-width',
                        'purpose' => 'Base border width token for UI elements.',
                        'behavior' => 'Direct numeric token used across components with outlines or dividers.',
                        'editable' => 'Yes',
                    ],
                    [
                        'token' => '--color--border-mix-amount',
                        'purpose' => 'Mix ratio used when generating derived border companion colors.',
                        'behavior' => 'Direct percentage token that influences border contrast from upstream colors.',
                        'editable' => 'Yes',
                    ],
                ],
            ],
            [
                'title' => 'Spacing',
                'summary' => 'Defines inner and outer rhythm values used by components and layouts.',
                'tokens' => [
                    [
                        'token' => '--space',
                        'purpose' => 'Standard internal spacing token for paddings and margins inside components.',
                        'behavior' => 'Direct numeric token commonly multiplied with --base.',
                        'editable' => 'Yes',
                    ],
                    [
                        'token' => '--outer-space',
                        'purpose' => 'Spacing token for gaps between components or for outer layout rhythm.',
                        'behavior' => 'Direct numeric token used for larger structural separation.',
                        'editable' => 'Yes',
                    ],
                ],
            ],
            [
                'title' => 'Shadows',
                'summary' => 'Provides the global inputs used by component shadow formulas.',
                'tokens' => [
                    [
                        'token' => '--shadow-color',
                        'purpose' => 'Base color used by shadow formulas.',
                        'behavior' => 'Direct RGBA token that controls the hue and transparency of elevation.',
                        'editable' => 'Yes',
                    ],
                    [
                        'token' => '--shadow-amount',
                        'purpose' => 'Global multiplier for shadow intensity.',
                        'behavior' => 'Direct numeric token that components combine with --base in shadow calculations.',
                        'editable' => 'Yes',
                    ],
                ],
            ],
        ];
    @endphp

    @typography([
        'element' => 'h1',
        'variant' => 'h1',
        'classList' => ['u-margin__bottom--2']
    ])
        Token System
    @endtypography

    @typography(['element' => 'p', 'variant' => 'body'])
        The token system keeps design decisions centralized, explicit, and overridable. Global tokens define the shared design language, component manifests declare which inputs are allowed, and component-scoped aliases provide the safe runtime override surface.
    @endtypography

    @divider(['size' => 'full', 'classList' => ['u-margin__top--6', 'u-margin__bottom--6']])
    @enddivider

    @notice([
        'type' => 'info',
        'message' => [
            'text' => 'This page focuses on the foundational non-color token surface. Color families and derived companion tones are documented separately on the Color system concept page.',
        ],
        'classList' => ['u-margin__bottom--4'],
    ])
    @endnotice

    @paper(['padding' => 4, 'classList' => ['u-margin__bottom--5']])
        @typography(['element' => 'h2', 'variant' => 'h2', 'classList' => ['u-margin__bottom--2']])
            Why the token system exists
        @endtypography

        @listing([
            'list' => [
                ['label' => 'Tokens replace one-off visual values with named system inputs, which keeps the design language consistent.'],
                ['label' => 'Global tokens define the shared runtime surface, while components only consume the tokens they explicitly declare.'],
                ['label' => 'Theme authors override the global layer, and local implementations should override component aliases rather than editing component Sass.'],
            ],
            'elementType' => 'ul',
        ])
        @endlisting
    @endpaper

    @typography(['element' => 'h2', 'variant' => 'h2', 'classList' => ['u-margin__bottom--2']])
        How the token system works
    @endtypography

    @typography(['element' => 'p', 'variant' => 'body', 'classList' => ['u-margin__bottom--4']])
        The implementation is intentionally explicit. Global tokens are defined once, compiled into CSS variables, mapped into component scope, and then consumed through helper functions. That keeps the customization surface stable and makes inheritance rules easier to reason about.
    @endtypography

    <div class="o-grid o-grid--large u-margin__bottom--5">
        @foreach ($architectureSteps as $step)
            <div class="o-grid-12 o-grid-4@md">
                @box([
                    'heading' => $step['title'],
                    'content' => $step['description'] . '<br><br><code>' . e($step['path']) . '</code>',
                    'icon' => 'schema',
                ])
                @endbox
            </div>
        @endforeach
    </div>

    @paper(['padding' => 4, 'classList' => ['u-margin__bottom--5']])
        @typography(['element' => 'h2', 'variant' => 'h2', 'classList' => ['u-margin__bottom--2']])
        Base token reference
        @endtypography

        @typography(['element' => 'p', 'variant' => 'body'])
        These are the foundational system tokens that the component layer builds on. Direct tokens are the intended customization inputs. Derived tokens are published for consumption, but their upstream inputs are the place to make supported changes.
        @endtypography
    @endpaper

    @foreach ($tokenSections as $section)
        <section class="u-margin__bottom--5">
            @typography(['element' => 'h3', 'variant' => 'h3', 'classList' => ['u-margin__bottom--1']])
                {{ $section['title'] }}
            @endtypography

            @typography(['element' => 'p', 'variant' => 'body', 'classList' => ['u-margin__bottom--2']])
                {{ $section['summary'] }}
            @endtypography

            @php
                $tokenRows = array_map(static function (array $token): array {
                    return [
                        'columns' => [
                            $token['token'],
                            $token['purpose'],
                            $token['behavior'],
                            $token['editable'],
                        ],
                    ];
                }, $section['tokens']);
            @endphp

            @paper(['padding' => 0])
                @table([
                    'headings' => ['Token', 'Purpose', 'How it works', 'Editable'],
                    'list' => $tokenRows,
                    'includePaper' => false,
                ])
                @endtable
            @endpaper
        </section>
    @endforeach
@stop
