@extends('layout.containers.doc')

@section('doc-content')
    @breadcrumb([
        'classList' => ['u-margin__bottom--3'],
        'list' => [
            ['href' => '/', 'label' => 'Home'],
            ['href' => '/concepts', 'label' => 'Concepts'],
            ['label' => 'Color system'],
        ]
    ])
    @endbreadcrumb

    @typography([
        'element' => 'h1',
        'variant' => 'h1',
        'classList' => ['u-margin__bottom--2']
    ])
        Color System
    @endtypography

    @typography(['element' => 'p', 'variant' => 'body'])
        An overview-first guide to the color token families, how companion tones are derived, and where each group belongs in the component layer.
    @endtypography

    @divider(['size' => 'full', 'classList' => ['u-margin__top--6', 'u-margin__bottom--6']])
    @enddivider

    <style>
        .color-system-summary-card {
            height: 100%;
        }

        .color-system-summary-card .c-box {
            height: 100%;
        }

        .color-system-kicker {
            font-family: var(--font-family-code, monospace);
            font-size: 0.72rem;
            font-weight: 600;
            color: var(--color--surface-contrast-muted);
            text-transform: uppercase;
            letter-spacing: 0.08em;
        }

        .color-system-stat-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
            gap: 1rem;
        }

        .color-system-stat-card {
            border: 1px solid var(--color--surface-border);
            border-radius: calc(var(--border-radius, 1) * 0.5rem);
            background: var(--color--surface);
            padding: 1rem;
        }

        .color-system-stat-value {
            display: block;
            font-size: 1.75rem;
            font-weight: 700;
            line-height: 1;
            color: var(--color--surface-contrast);
            margin-bottom: 0.35rem;
        }

        .color-system-stat-label {
            display: block;
            font-size: 0.82rem;
            color: var(--color--surface-contrast-muted);
            line-height: 1.4;
        }

        .color-system-family-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 1rem;
        }

        .color-system-family-card {
            border: 1px solid var(--color--surface-border);
            border-radius: calc(var(--border-radius, 1) * 0.6rem);
            background: var(--color--surface);
            overflow: hidden;
            display: flex;
            flex-direction: column;
            min-height: 100%;
        }

        .color-system-family-card__header {
            padding: 1rem;
            min-height: 124px;
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            gap: 0.35rem;
            border-bottom: 1px solid color-mix(in srgb, var(--color--surface-border) 65%, transparent);
        }

        .color-system-family-card__token {
            font-family: var(--font-family-code, monospace);
            font-size: 0.74rem;
            font-weight: 700;
            line-height: 1.35;
            word-break: break-all;
        }

        .color-system-family-card__meta {
            font-size: 0.72rem;
            line-height: 1.35;
            opacity: 0.88;
        }

        .color-system-family-card__body {
            padding: 1rem;
            display: flex;
            flex-direction: column;
            gap: 0.9rem;
        }

        .color-system-family-card__usage {
            font-size: 0.82rem;
            line-height: 1.55;
            color: var(--color--surface-contrast);
        }

        .color-system-companion-list {
            display: grid;
            gap: 0.75rem;
        }

        .color-system-companion {
            display: grid;
            grid-template-columns: 44px 1fr;
            gap: 0.75rem;
            align-items: start;
        }

        .color-system-companion__preview {
            height: 44px;
            border-radius: calc(var(--border-radius, 1) * 0.35rem);
            border: 1px solid var(--color--surface-border);
            background: var(--color--surface-alt);
        }

        .color-system-companion__name {
            display: block;
            font-family: var(--font-family-code, monospace);
            font-size: 0.72rem;
            font-weight: 700;
            line-height: 1.4;
            color: var(--color--surface-contrast);
            word-break: break-all;
        }

        .color-system-companion__meta,
        .color-system-companion__usage {
            display: block;
            font-size: 0.72rem;
            line-height: 1.45;
            color: var(--color--surface-contrast-muted);
            margin-top: 0.15rem;
        }

        .color-system-formula {
            display: block;
            margin-top: 0.3rem;
            padding: 0.35rem 0.5rem;
            border-radius: calc(var(--border-radius, 1) * 0.25rem);
            background: var(--color--surface-alt);
            font-family: var(--font-family-code, monospace);
            font-size: 0.68rem;
            line-height: 1.45;
            color: var(--color--surface-contrast-muted);
            word-break: break-all;
        }

        .color-system-mix-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
            gap: 1rem;
        }

        .color-system-mix-card {
            border: 1px solid var(--color--surface-border);
            border-radius: calc(var(--border-radius, 1) * 0.5rem);
            padding: 1rem;
            background: var(--color--surface);
        }

        .color-system-mix-diagram {
            display: flex;
            align-items: center;
            gap: 0.45rem;
            flex-wrap: wrap;
        }

        .color-system-mix-diagram__swatch {
            width: 1.5rem;
            height: 1.5rem;
            border-radius: 4px;
            border: 1px solid var(--color--surface-border);
            flex: none;
        }

        .color-system-mix-diagram__label {
            font-family: var(--font-family-code, monospace);
            font-size: 0.74rem;
            color: var(--color--surface-contrast);
        }

        .color-system-mix-diagram__arrow {
            color: var(--color--surface-contrast-muted);
            font-size: 0.82rem;
        }

        .color-system-palette-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
            gap: 0.9rem;
        }

        .color-system-palette-card {
            border: 1px solid var(--color--surface-border);
            border-radius: calc(var(--border-radius, 1) * 0.5rem);
            background: var(--color--surface);
            overflow: hidden;
        }

        .color-system-palette-card__swatch {
            min-height: 84px;
            padding: 0.9rem;
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            gap: 0.25rem;
            border-bottom: 1px solid var(--color--surface-border);
        }

        .color-system-palette-card__list {
            padding: 0.8rem 0.9rem 0.9rem;
            font-size: 0.72rem;
            line-height: 1.55;
            color: var(--color--surface-contrast-muted);
        }
    </style>

    @php
        $colorGroups = [
            [
                'id' => 'brand-colors',
                'title' => 'Brand Colors',
                'summary' => 'Primary and secondary interaction families.',
                'description' => 'Use these for the core branded actions and accents. They are the families most often mapped into buttons, links, tags, and emphasized UI states.',
                'families' => [
                    [
                        'base' => ['var' => '--color--primary', 'label' => 'Primary', 'default' => '#2d2d2d', 'editable' => true, 'usage' => 'Main interactive color for primary buttons, active navigation, and strong highlights.'],
                        'companions' => [
                            ['var' => '--color--primary-contrast', 'label' => 'Contrast', 'default' => '#ffffff', 'editable' => true, 'usage' => 'Text and icons displayed directly on the primary surface.'],
                            ['var' => '--color--primary-border', 'label' => 'Border', 'editable' => false, 'formula' => 'color-mix(in srgb, var(--color--primary-contrast) var(--color--border-mix-amount), var(--color--primary))', 'usage' => 'Hover states, outlines, and dividers on primary-colored surfaces.'],
                            ['var' => '--color--primary-alt', 'label' => 'Alt', 'editable' => false, 'formula' => 'color-mix(in srgb, var(--color--primary-contrast) var(--color--alt-mix-amount), var(--color--primary))', 'usage' => 'Subtle selected or active fills related to the primary family.'],
                        ],
                    ],
                    [
                        'base' => ['var' => '--color--secondary', 'label' => 'Secondary', 'default' => '#6e6e6e', 'editable' => true, 'usage' => 'Supporting interaction color for secondary actions and quieter highlights.'],
                        'companions' => [
                            ['var' => '--color--secondary-contrast', 'label' => 'Contrast', 'default' => '#ffffff', 'editable' => true, 'usage' => 'Text and icons displayed on secondary-colored surfaces.'],
                            ['var' => '--color--secondary-border', 'label' => 'Border', 'editable' => false, 'formula' => 'color-mix(in srgb, var(--color--secondary-contrast) var(--color--border-mix-amount), var(--color--secondary))', 'usage' => 'Hover states, outlines, and dividers on secondary-colored surfaces.'],
                            ['var' => '--color--secondary-alt', 'label' => 'Alt', 'editable' => false, 'formula' => 'color-mix(in srgb, var(--color--secondary-contrast) var(--color--alt-mix-amount), var(--color--secondary))', 'usage' => 'Subtle background states related to the secondary family.'],
                        ],
                    ],
                ],
            ],
            [
                'id' => 'layout-colors',
                'title' => 'Layout Colors',
                'summary' => 'Background and surface layers.',
                'description' => 'These families define the canvas and the raised surfaces above it. They are the foundation for readable UI structure, separators, muted text, and nested containers.',
                'families' => [
                    [
                        'base' => ['var' => '--color--background', 'label' => 'Background', 'default' => '#f5f5f5', 'editable' => true, 'usage' => 'The outer page canvas and the lowest visual layer.'],
                        'companions' => [
                            ['var' => '--color--background-contrast', 'label' => 'Contrast', 'default' => '#2d2d2d', 'editable' => true, 'usage' => 'Primary text and icons placed directly on the page background.'],
                            ['var' => '--color--background-contrast-muted', 'label' => 'Contrast muted', 'editable' => false, 'formula' => 'color-mix(in srgb, var(--color--background-contrast) 67.5%, var(--color--background))', 'usage' => 'Reduced-emphasis text and metadata on the background layer.'],
                            ['var' => '--color--background-border', 'label' => 'Border', 'editable' => false, 'formula' => 'color-mix(in srgb, var(--color--background-contrast) var(--color--border-mix-amount), var(--color--background))', 'usage' => 'Separators and borders that live on the page background.'],
                            ['var' => '--color--background-alt', 'label' => 'Alt', 'editable' => false, 'formula' => 'color-mix(in srgb, var(--color--background-contrast-muted) var(--color--alt-mix-amount), var(--color--background))', 'usage' => 'Subtle zebra rows, hover states, and inset fills on the background layer.'],
                        ],
                    ],
                    [
                        'base' => ['var' => '--color--surface', 'label' => 'Surface', 'default' => '#ffffff', 'editable' => true, 'usage' => 'Raised surfaces such as cards, drawers, dialogs, and dropdowns.'],
                        'companions' => [
                            ['var' => '--color--surface-contrast', 'label' => 'Contrast', 'default' => '#2d2d2d', 'editable' => true, 'usage' => 'Primary text and icons on raised surfaces.'],
                            ['var' => '--color--surface-contrast-muted', 'label' => 'Contrast muted', 'editable' => false, 'formula' => 'color-mix(in srgb, var(--color--surface-contrast) 67.5%, var(--color--surface))', 'usage' => 'Secondary text and metadata inside cards and panels.'],
                            ['var' => '--color--surface-border', 'label' => 'Border', 'editable' => false, 'formula' => 'color-mix(in srgb, var(--color--surface-contrast) var(--color--border-mix-amount), var(--color--surface))', 'usage' => 'Card outlines, inputs, and internal separators on surface elements.'],
                            ['var' => '--color--surface-alt', 'label' => 'Alt', 'editable' => false, 'formula' => 'color-mix(in srgb, var(--color--surface-contrast-muted) var(--color--alt-mix-amount), var(--color--surface))', 'usage' => 'Inset areas and subtle fills inside raised surfaces.'],
                        ],
                    ],
                ],
            ],
            [
                'id' => 'ui-colors',
                'title' => 'UI Colors',
                'summary' => 'Cross-cutting utility colors.',
                'description' => 'These tokens support focus indication and overlays across all components, independent of the brand families.',
                'families' => [
                    [
                        'base' => ['var' => '--color--focus', 'label' => 'Focus', 'default' => '#4d90fe', 'editable' => true, 'usage' => 'Keyboard focus rings and other attention markers.'],
                        'companions' => [],
                    ],
                    [
                        'base' => ['var' => '--color--alpha', 'label' => 'Alpha', 'default' => 'rgba(0, 0, 0, 0.55)', 'editable' => true, 'usage' => 'Scrims and overlays behind dialogs, drawers, and tooltips.'],
                        'companions' => [
                            ['var' => '--color--alpha-contrast', 'label' => 'Contrast', 'default' => '#ffffff', 'editable' => true, 'usage' => 'Readable text and icons when something sits on the alpha overlay.'],
                            ['var' => '--color--alpha-border', 'label' => 'Border', 'editable' => false, 'formula' => 'color-mix(in srgb, var(--color--alpha-contrast) var(--color--border-mix-amount), var(--color--alpha))', 'usage' => 'Borders and separators shown directly on overlay surfaces.'],
                        ],
                    ],
                ],
            ],
            [
                'id' => 'state-colors',
                'title' => 'State Colors',
                'summary' => 'Semantic feedback families.',
                'description' => 'Use these for product meaning rather than brand meaning: success, warning, danger, and info states stay recognizable even when the theme changes.',
                'families' => [
                    [
                        'base' => ['var' => '--color--success', 'label' => 'Success', 'default' => '#4caf50', 'editable' => true, 'usage' => 'Validated, completed, or otherwise positive outcomes.'],
                        'companions' => [
                            ['var' => '--color--success-contrast', 'label' => 'Contrast', 'default' => '#ffffff', 'editable' => true, 'usage' => 'Text and icons on success surfaces.'],
                            ['var' => '--color--success-border', 'label' => 'Border', 'editable' => false, 'formula' => 'color-mix(in srgb, var(--color--success-contrast) var(--color--border-mix-amount), var(--color--success))', 'usage' => 'Outlines and hover states for success notices and badges.'],
                        ],
                    ],
                    [
                        'base' => ['var' => '--color--warning', 'label' => 'Warning', 'default' => '#ffb300', 'editable' => true, 'usage' => 'Caution, incomplete progress, or temporary blockers.'],
                        'companions' => [
                            ['var' => '--color--warning-contrast', 'label' => 'Contrast', 'default' => '#2d2d2d', 'editable' => true, 'usage' => 'Dark text and icons on light warning surfaces.'],
                            ['var' => '--color--warning-border', 'label' => 'Border', 'editable' => false, 'formula' => 'color-mix(in srgb, var(--color--warning-contrast) var(--color--border-mix-amount), var(--color--warning))', 'usage' => 'Outlines and hover states for warning surfaces.'],
                        ],
                    ],
                    [
                        'base' => ['var' => '--color--danger', 'label' => 'Danger', 'default' => '#e53935', 'editable' => true, 'usage' => 'Destructive actions and error states.'],
                        'companions' => [
                            ['var' => '--color--danger-contrast', 'label' => 'Contrast', 'default' => '#ffffff', 'editable' => true, 'usage' => 'Text and icons on danger surfaces.'],
                            ['var' => '--color--danger-border', 'label' => 'Border', 'editable' => false, 'formula' => 'color-mix(in srgb, var(--color--danger-contrast) var(--color--border-mix-amount), var(--color--danger))', 'usage' => 'Outlines and hover states for destructive surfaces.'],
                        ],
                    ],
                    [
                        'base' => ['var' => '--color--info', 'label' => 'Info', 'default' => '#039be5', 'editable' => true, 'usage' => 'Informational notices and neutral contextual cues.'],
                        'companions' => [
                            ['var' => '--color--info-contrast', 'label' => 'Contrast', 'default' => '#ffffff', 'editable' => true, 'usage' => 'Text and icons on info surfaces.'],
                            ['var' => '--color--info-border', 'label' => 'Border', 'editable' => false, 'formula' => 'color-mix(in srgb, var(--color--info-contrast) var(--color--border-mix-amount), var(--color--info))', 'usage' => 'Outlines and hover states for informational surfaces.'],
                        ],
                    ],
                ],
            ],
        ];

        $groupSummaries = [
            ['heading' => 'Brand families', 'content' => 'Primary and secondary interaction colors with derived companions.', 'link' => '#brand-colors', 'icon' => 'ads_click'],
            ['heading' => 'Layout layers', 'content' => 'Background and surface tokens that define the page structure.', 'link' => '#layout-colors', 'icon' => 'dashboard'],
            ['heading' => 'State feedback', 'content' => 'Semantic success, warning, danger, and info families.', 'link' => '#state-colors', 'icon' => 'notifications'],
            ['heading' => 'Palette slots', 'content' => 'Optional project-specific accent slots you can fill per theme.', 'link' => '#brand-palette', 'icon' => 'palette'],
        ];

        $editableBaseCount = array_reduce($colorGroups, function ($carry, $group) {
            return $carry + count($group['families']);
        }, 0) + 10;

        $autoCompanionCount = array_reduce($colorGroups, function ($carry, $group) {
            return $carry + array_reduce($group['families'], function ($familyCarry, $family) {
                return $familyCarry + count(array_filter($family['companions'], function ($companion) {
                    return ($companion['editable'] ?? false) === false;
                }));
            }, 0);
        }, 0) + 30;
    @endphp

    @typography(['element' => 'h1', 'variant' => 'h1', 'classList' => ['u-margin__bottom--1']])
        Color System
    @endtypography

    @typography(['element' => 'p', 'variant' => 'body', 'classList' => ['u-margin__bottom--4']])
        This page starts with the big picture and then drills down into each family. Use it to answer three questions quickly: which family a component should use, which companions are editable versus generated, and which mix rule produces the supporting tones.
    @endtypography

    <div class="o-grid o-grid--large u-margin__bottom--5" id="overview">
        @foreach($groupSummaries as $summary)
            <div class="o-grid-12 o-grid-6@md o-grid-3@lg color-system-summary-card">
                @box([
                    'heading' => $summary['heading'],
                    'content' => $summary['content'],
                    'link' => $summary['link'],
                    'icon' => $summary['icon'],
                ])
                @endbox
            </div>
        @endforeach
    </div>

    @paper(['padding' => 4, 'classList' => ['u-margin__bottom--5']])
        <span class="color-system-kicker u-margin__bottom--1" aria-hidden="true">At a glance</span>
        @typography(['element' => 'h2', 'variant' => 'h2', 'classList' => ['u-margin__bottom--2']])
            Read the system from base token to companion family
        @endtypography

        @typography(['element' => 'p', 'variant' => 'body', 'classList' => ['u-margin__bottom--3']])
            Every family starts with an editable base token. Most families then expose one editable contrast token and one or more generated companions that power borders, subtle fills, hover states, and muted text. The cards below are arranged so that the family role comes first and the formulas come second.
        @endtypography

        <div class="color-system-stat-grid">
            <div class="color-system-stat-card">
                <span class="color-system-stat-value">{{ $editableBaseCount }}</span>
                <span class="color-system-stat-label">Editable base families across brand, layout, utility, state, and palette.</span>
            </div>
            <div class="color-system-stat-card">
                <span class="color-system-stat-value">{{ $autoCompanionCount }}</span>
                <span class="color-system-stat-label">Generated companions that stay in sync when the base or mix amounts change.</span>
            </div>
            <div class="color-system-stat-card">
                <span class="color-system-stat-value">2</span>
                <span class="color-system-stat-label">Global mix controls that tune the strength of border and alt companions system-wide.</span>
            </div>
            <div class="color-system-stat-card">
                <span class="color-system-stat-value">10</span>
                <span class="color-system-stat-label">Optional palette slots reserved for project, campaign, or seasonal accents.</span>
            </div>
        </div>
    @endpaper

    @notice([
        'type' => 'info',
        'message' => [
            'text' => 'Use the base token when you need to choose a family, use the contrast token when content sits on top of it, and let the generated companions handle borders, hover fills, and subtle surface states.',
        ],
        'classList' => ['u-margin__bottom--5'],
    ])
    @endnotice

    @paper(['padding' => 4, 'classList' => ['u-margin__bottom--5'], 'attributeList' => ['id' => 'token-anatomy']])
        <span class="color-system-kicker u-margin__bottom--1" aria-hidden="true">Token anatomy</span>
        @typography(['element' => 'h2', 'variant' => 'h2', 'classList' => ['u-margin__bottom--2']])
            The three derivation patterns you see throughout the page
        @endtypography

        <div class="color-system-mix-grid u-margin__bottom--3">
            <div class="color-system-mix-card">
                @typography(['element' => 'h3', 'variant' => 'h3', 'classList' => ['u-margin__bottom--1']])
                    Border companion
                @endtypography
                @typography(['element' => 'p', 'variant' => 'body', 'classList' => ['u-margin__bottom--2']])
                    A stronger mix used for outlines, dividers, and hover states where the color shift must remain visible against the base.
                @endtypography
                <div class="color-system-mix-diagram">
                    <span class="color-system-mix-diagram__swatch" style="background: var(--color--primary-contrast);"></span>
                    <span class="color-system-mix-diagram__label">contrast</span>
                    <span class="color-system-mix-diagram__arrow">+</span>
                    <span class="color-system-mix-diagram__swatch" style="background: var(--color--primary);"></span>
                    <span class="color-system-mix-diagram__label">base</span>
                    <span class="color-system-mix-diagram__arrow">=</span>
                    <span class="color-system-mix-diagram__swatch" style="background: var(--color--primary-border);"></span>
                    <span class="color-system-mix-diagram__label">border</span>
                </div>
                <code class="color-system-formula">color-mix(in srgb, contrast var(--color--border-mix-amount), base)</code>
            </div>

            <div class="color-system-mix-card">
                @typography(['element' => 'h3', 'variant' => 'h3', 'classList' => ['u-margin__bottom--1']])
                    Alt companion
                @endtypography
                @typography(['element' => 'p', 'variant' => 'body', 'classList' => ['u-margin__bottom--2']])
                    A lighter-touch mix used for subtle fills such as selected rows, inset areas, and quiet active states.
                @endtypography
                <div class="color-system-mix-diagram">
                    <span class="color-system-mix-diagram__swatch" style="background: var(--color--primary-contrast);"></span>
                    <span class="color-system-mix-diagram__label">contrast</span>
                    <span class="color-system-mix-diagram__arrow">+</span>
                    <span class="color-system-mix-diagram__swatch" style="background: var(--color--primary);"></span>
                    <span class="color-system-mix-diagram__label">base</span>
                    <span class="color-system-mix-diagram__arrow">=</span>
                    <span class="color-system-mix-diagram__swatch" style="background: var(--color--primary-alt);"></span>
                    <span class="color-system-mix-diagram__label">alt</span>
                </div>
                <code class="color-system-formula">color-mix(in srgb, contrast var(--color--alt-mix-amount), base)</code>
            </div>

            <div class="color-system-mix-card">
                @typography(['element' => 'h3', 'variant' => 'h3', 'classList' => ['u-margin__bottom--1']])
                    Contrast-muted companion
                @endtypography
                @typography(['element' => 'p', 'variant' => 'body', 'classList' => ['u-margin__bottom--2']])
                    A fixed readability pattern used by layout families so secondary text keeps a consistent relationship to the surface.
                @endtypography
                <div class="color-system-mix-diagram">
                    <span class="color-system-mix-diagram__swatch" style="background: var(--color--surface-contrast);"></span>
                    <span class="color-system-mix-diagram__label">contrast</span>
                    <span class="color-system-mix-diagram__arrow">+</span>
                    <span class="color-system-mix-diagram__swatch" style="background: var(--color--surface);"></span>
                    <span class="color-system-mix-diagram__label">surface</span>
                    <span class="color-system-mix-diagram__arrow">=</span>
                    <span class="color-system-mix-diagram__swatch" style="background: var(--color--surface-contrast-muted);"></span>
                    <span class="color-system-mix-diagram__label">contrast-muted</span>
                </div>
                <code class="color-system-formula">color-mix(in srgb, contrast 67.5%, base)</code>
            </div>
        </div>

        @listing([
            'list' => [
                ['label' => 'Editable tokens are the design decisions you make directly: base colors and most contrast colors.'],
                ['label' => 'Generated tokens keep the system consistent: borders, alt tones, and muted contrast colors update automatically.'],
                ['label' => 'The color families below are grouped by purpose first, so you can choose the right family before thinking about formulas.'],
            ],
            'elementType' => 'ul',
        ])
        @endlisting
    @endpaper

    @foreach($colorGroups as $group)
        @paper(['padding' => 4, 'classList' => ['u-margin__bottom--5'], 'attributeList' => ['id' => $group['id']]])
            <span class="color-system-kicker u-margin__bottom--1" aria-hidden="true">{{ $group['summary'] }}</span>
            @typography(['element' => 'h2', 'variant' => 'h2', 'classList' => ['u-margin__bottom--1']])
                {{ $group['title'] }}
            @endtypography

            @typography(['element' => 'p', 'variant' => 'body', 'classList' => ['u-margin__bottom--3']])
                {{ $group['description'] }}
            @endtypography

            <div class="color-system-family-grid">
                @foreach($group['families'] as $family)
                    @php $base = $family['base']; @endphp
                    <article class="color-system-family-card">
                        <div class="color-system-family-card__header" style="background: var({{ $base['var'] }}); color: var({{ $base['var'] }}-contrast, var(--color--surface-contrast));">
                            <span class="color-system-family-card__token">{{ $base['var'] }}</span>
                            <span class="color-system-family-card__meta">
                                {{ $base['label'] }}
                                @if(!empty($base['default'])) · {{ $base['default'] }} @endif
                                @if($base['editable']) · Editable @else · Locked @endif
                            </span>
                        </div>

                        <div class="color-system-family-card__body">
                            <div class="color-system-family-card__usage">{{ $base['usage'] }}</div>

                            @if(!empty($family['companions']))
                                <div class="color-system-companion-list">
                                    @foreach($family['companions'] as $companion)
                                        <div class="color-system-companion">
                                            <div class="color-system-companion__preview" style="background: var({{ $companion['var'] }});"></div>
                                            <div>
                                                <span class="color-system-companion__name">{{ $companion['var'] }}</span>
                                                <span class="color-system-companion__meta">
                                                    {{ $companion['label'] }}
                                                    @if(!empty($companion['default'])) · {{ $companion['default'] }} @endif
                                                    @if($companion['editable']) · Editable @else · Auto-generated @endif
                                                </span>
                                                @if(!empty($companion['usage']))
                                                    <span class="color-system-companion__usage">{{ $companion['usage'] }}</span>
                                                @endif
                                                @if(!empty($companion['formula']))
                                                    <code class="color-system-formula">{{ $companion['formula'] }}</code>
                                                @endif
                                            </div>
                                        </div>
                                    @endforeach
                                </div>
                            @else
                                <span class="color-system-companion__usage">This token stands alone and is typically consumed directly by the component that needs it.</span>
                            @endif
                        </div>
                    </article>
                @endforeach
            </div>
        @endpaper
    @endforeach

    @paper(['padding' => 4, 'classList' => ['u-margin__bottom--5'], 'attributeList' => ['id' => 'brand-palette']])
        <span class="color-system-kicker u-margin__bottom--1" aria-hidden="true">Optional accent slots</span>
        @typography(['element' => 'h2', 'variant' => 'h2', 'classList' => ['u-margin__bottom--1']])
            Brand Palette
        @endtypography

        @typography(['element' => 'p', 'variant' => 'body', 'classList' => ['u-margin__bottom--3']])
            The ten palette slots are intentionally empty by default. Fill them when a project needs campaign, department, or seasonal accent families without redefining the core brand colors.
        @endtypography

        <div class="color-system-palette-grid u-margin__bottom--3">
            @for($i = 1; $i <= 10; $i++)
                <article class="color-system-palette-card">
                    <div class="color-system-palette-card__swatch" style="background: var(--color--palette-{{ $i }}); color: var(--color--palette-{{ $i }}-contrast, var(--color--surface-contrast));">
                        <span class="color-system-family-card__token">--color--palette-{{ $i }}</span>
                        <span class="color-system-family-card__meta">Palette {{ $i }} · transparent by default</span>
                    </div>
                    <div class="color-system-palette-card__list">
                        Contrast: <code>--color--palette-{{ $i }}-contrast</code><br>
                        Border: <code>--color--palette-{{ $i }}-border</code><br>
                        Alt: <code>--color--palette-{{ $i }}-alt</code>
                    </div>
                </article>
            @endfor
        </div>

        @notice([
            'type' => 'info',
            'message' => [
                'text' => 'Palette slots stay invisible until you assign them. Once filled, any component that supports a palette family can consume the slot with the same companion-token rules as the built-in brand families.',
            ],
        ])
        @endnotice
    @endpaper

    <div class="o-grid o-grid--large">
        <div class="o-grid-12 o-grid-6@md">
            @paper(['padding' => 4, 'classList' => ['u-height--100']])
                <span class="color-system-kicker u-margin__bottom--1" aria-hidden="true">Global controls</span>
                @typography(['element' => 'h2', 'variant' => 'h2', 'classList' => ['u-margin__bottom--2']])
                    Mix amount tokens
                @endtypography

                @listing([
                    'list' => [
                        ['label' => '--color--border-mix-amount controls how clearly hover, outlines, and border companions stand apart from the base family.'],
                        ['label' => '--color--alt-mix-amount controls how subtle or visible the softer companion fills feel across the whole system.'],
                        ['label' => 'Because these are global controls, changing one amount rebalances every generated companion of that type at once.'],
                    ],
                    'elementType' => 'ul',
                ])
                @endlisting
            @endpaper
        </div>
        <div class="o-grid-12 o-grid-6@md">
            @paper(['padding' => 4, 'classList' => ['u-height--100']])
                <span class="color-system-kicker u-margin__bottom--1" aria-hidden="true">Working with the system</span>
                @typography(['element' => 'h2', 'variant' => 'h2', 'classList' => ['u-margin__bottom--2']])
                    Changing colors
                @endtypography

                @listing([
                    'list' => [
                        ['label' => 'Change a base token when you want a new family identity. The generated companions will follow automatically.'],
                        ['label' => 'Change a contrast token when readability on top of the base surface needs adjustment.'],
                        ['label' => 'Use palette slots when you need extra accent families without touching the primary brand colors.'],
                    ],
                    'elementType' => 'ul',
                ])
                @endlisting
            @endpaper
        </div>
    </div>
@stop