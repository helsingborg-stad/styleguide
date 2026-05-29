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
        .color-system-kicker {
            font-family: var(--font-family-code, monospace);
            font-size: 0.68rem;
            font-weight: 600;
            color: var(--color--surface-contrast-muted);
            text-transform: uppercase;
            letter-spacing: 0.06em;
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

        .color-system-section-heading {
            margin-bottom: 0.5rem;
        }

        .color-system-formula {
            display: inline-block;
            margin-top: 0.5rem;
            padding: 0.35rem 0.5rem;
            border-radius: calc(var(--border-radius, 1) * 0.25rem);
            background: var(--color--surface-alt);
            font-family: var(--font-family-code, monospace);
            font-size: 0.68rem;
            line-height: 1.45;
            color: var(--color--surface-contrast-muted);
            word-break: break-word;
        }

        .color-system-intro-list {
            margin: 0;
            padding-left: 1.1rem;
            color: var(--color--surface-contrast-muted);
        }

        .color-system-intro-list li + li {
            margin-top: 0.45rem;
        }

        .color-system-anatomy-row {
            display: flex;
            align-items: center;
            gap: 0.65rem;
            flex-wrap: wrap;
            margin-top: 0.85rem;
        }

        .color-system-anatomy-swatch {
            width: 2.5rem;
            height: 2.5rem;
            border-radius: calc(var(--border-radius, 1) * 0.35rem);
            border: 1px solid var(--color--surface-border);
            flex: none;
        }

        .color-system-anatomy-label {
            font-family: var(--font-family-code, monospace);
            font-size: 0.74rem;
            color: var(--color--surface-contrast);
        }

        .color-system-family-overview {
            display: grid;
            gap: 1rem;
        }

        .color-system-base-swatch {
            min-height: 144px;
            border-radius: calc(var(--border-radius, 1) * 0.55rem);
            border: 1px solid var(--color--surface-border);
            padding: 1rem;
            display: grid;
            align-content: end;
            gap: 0.35rem;
        }

        .color-system-base-swatch__eyebrow {
            display: block;
            font-size: 0.7rem;
            text-transform: uppercase;
            letter-spacing: 0.06em;
            opacity: 0.8;
        }

        .color-system-base-swatch__token {
            display: block;
            font-family: var(--font-family-code, monospace);
            font-size: 0.85rem;
            font-weight: 700;
            line-height: 1.4;
            word-break: break-all;
        }

        .color-system-base-swatch__meta {
            display: block;
            font-size: 0.72rem;
            line-height: 1.45;
            opacity: 0.9;
        }

        .color-system-family-usage {
            margin: 0;
            font-size: 0.92rem;
            line-height: 1.55;
            color: var(--color--surface-contrast);
        }

        .color-system-companion-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
            gap: 1rem;
        }

        .color-system-companion-card {
            border: 1px solid var(--color--surface-border);
            border-radius: calc(var(--border-radius, 1) * 0.5rem);
            padding: 1rem;
            background: var(--color--surface);
        }

        .color-system-companion-card__preview {
            width: 100%;
            height: 4.5rem;
            border-radius: calc(var(--border-radius, 1) * 0.35rem);
            border: 1px solid var(--color--surface-border);
            margin-bottom: 0.75rem;
        }

        .color-system-companion-card__name {
            display: block;
            font-family: var(--font-family-code, monospace);
            font-size: 0.74rem;
            font-weight: 700;
            line-height: 1.4;
            color: var(--color--surface-contrast);
            word-break: break-all;
        }

        .color-system-companion-card__meta,
        .color-system-companion-card__usage {
            display: block;
            margin-top: 0.25rem;
            font-size: 0.74rem;
            line-height: 1.5;
            color: var(--color--surface-contrast-muted);
        }

        .color-system-accordion {
            margin-top: 1rem;
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

        .color-system-palette-card[hidden],
        .color-system-palette-section[hidden] {
            display: none;
        }

        .color-system-palette-card__swatch {
            min-height: 120px;
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

        .color-system-palette-card__token {
            display: block;
            font-family: var(--font-family-code, monospace);
            font-size: 0.82rem;
            font-weight: 700;
            line-height: 1.35;
            word-break: break-all;
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

        $renderCompanion = static function (array $companion): string {
            $default = !empty($companion['default']) ? ' · ' . e($companion['default']) : '';
            $state = !empty($companion['editable']) ? 'Editable' : 'Auto-generated';
            $formula = !empty($companion['formula']) ? '<code class="color-system-formula">' . e($companion['formula']) . '</code>' : '';
            $usage = !empty($companion['usage']) ? '<span class="color-system-companion-card__usage">' . e($companion['usage']) . '</span>' : '';

            return '<article class="color-system-companion-card">'
                . '<div class="color-system-companion-card__preview" style="background: var(' . e($companion['var']) . ');"></div>'
                . '<span class="color-system-companion-card__name">' . e($companion['var']) . '</span>'
                . '<span class="color-system-companion-card__meta">' . e($companion['label']) . $default . ' · ' . $state . '</span>'
                . $usage
                . $formula
                . '</article>';
        };

        $renderFamilyContent = static function (array $family) use ($renderCompanion): string {
            $base = $family['base'];
            $default = !empty($base['default']) ? ' · ' . e($base['default']) : '';
            $state = !empty($base['editable']) ? 'Editable' : 'Locked';
            $companions = !empty($family['companions'])
                ? '<div class="color-system-companion-grid">' . implode('', array_map($renderCompanion, $family['companions'])) . '</div>'
                : '<p class="color-system-family-usage">This token stands alone and is typically consumed directly by the component that needs it.</p>';

            return '<div class="color-system-family-overview">'
                . '<div class="color-system-base-swatch" style="background: var(' . e($base['var']) . '); color: var(' . e($base['var']) . '-contrast, var(--color--surface-contrast));">'
                . '<span class="color-system-base-swatch__eyebrow">Base token</span>'
                . '<span class="color-system-base-swatch__token">' . e($base['var']) . '</span>'
                . '<span class="color-system-base-swatch__meta">' . e($base['label']) . $default . ' · ' . $state . '</span>'
                . '</div>'
                . '<p class="color-system-family-usage">' . e($base['usage']) . '</p>'
                . $companions
                . '</div>';
        };

        $anatomyItems = [
            [
                'heading' => 'Border companion',
                'content' => '<p>A stronger mix used for outlines, dividers, and hover states where the color shift must remain visible against the base.</p>'
                    . '<div class="color-system-anatomy-row">'
                    . '<span class="color-system-anatomy-swatch" style="background: var(--color--primary-contrast);"></span><span class="color-system-anatomy-label">contrast</span>'
                    . '<span class="color-system-anatomy-swatch" style="background: var(--color--primary);"></span><span class="color-system-anatomy-label">base</span>'
                    . '<span class="color-system-anatomy-swatch" style="background: var(--color--primary-border);"></span><span class="color-system-anatomy-label">border</span>'
                    . '</div>'
                    . '<code class="color-system-formula">color-mix(in srgb, contrast var(--color--border-mix-amount), base)</code>',
            ],
            [
                'heading' => 'Alt companion',
                'content' => '<p>A lighter-touch mix used for subtle fills such as selected rows, inset areas, and quiet active states.</p>'
                    . '<div class="color-system-anatomy-row">'
                    . '<span class="color-system-anatomy-swatch" style="background: var(--color--primary-contrast);"></span><span class="color-system-anatomy-label">contrast</span>'
                    . '<span class="color-system-anatomy-swatch" style="background: var(--color--primary);"></span><span class="color-system-anatomy-label">base</span>'
                    . '<span class="color-system-anatomy-swatch" style="background: var(--color--primary-alt);"></span><span class="color-system-anatomy-label">alt</span>'
                    . '</div>'
                    . '<code class="color-system-formula">color-mix(in srgb, contrast var(--color--alt-mix-amount), base)</code>',
            ],
            [
                'heading' => 'Contrast-muted companion',
                'content' => '<p>A fixed readability pattern used by layout families so secondary text keeps a consistent relationship to the surface.</p>'
                    . '<div class="color-system-anatomy-row">'
                    . '<span class="color-system-anatomy-swatch" style="background: var(--color--surface-contrast);"></span><span class="color-system-anatomy-label">contrast</span>'
                    . '<span class="color-system-anatomy-swatch" style="background: var(--color--surface);"></span><span class="color-system-anatomy-label">surface</span>'
                    . '<span class="color-system-anatomy-swatch" style="background: var(--color--surface-contrast-muted);"></span><span class="color-system-anatomy-label">contrast-muted</span>'
                    . '</div>'
                    . '<code class="color-system-formula">color-mix(in srgb, contrast 67.5%, base)</code>',
            ],
        ];

        $guidanceItems = [
            [
                'heading' => 'Mix amount tokens',
                'content' => '<ul class="color-system-intro-list">'
                    . '<li><strong>--color--border-mix-amount</strong> controls how clearly hover, outlines, and border companions stand apart from the base family.</li>'
                    . '<li><strong>--color--alt-mix-amount</strong> controls how subtle or visible the softer companion fills feel across the whole system.</li>'
                    . '<li>Because these are global controls, changing one amount rebalances every generated companion of that type at once.</li>'
                    . '</ul>',
            ],
            [
                'heading' => 'Changing colors',
                'content' => '<ul class="color-system-intro-list">'
                    . '<li>Change a base token when you want a new family identity. The generated companions will follow automatically.</li>'
                    . '<li>Change a contrast token when readability on top of the base surface needs adjustment.</li>'
                    . '<li>Use palette slots when you need extra accent families without touching the primary brand colors.</li>'
                    . '</ul>',
            ],
        ];
    @endphp

    @paper(['padding' => 4, 'classList' => ['u-margin__bottom--5'], 'attributeList' => ['id' => 'overview']])
        <span class="color-system-kicker">How to use this page</span>
        @typography(['element' => 'h2', 'variant' => 'h3', 'classList' => ['color-system-section-heading']])
            Start with the family, then expand only what you need.
        @endtypography

        <ul class="color-system-intro-list">
            <li>Use the overview numbers to understand system size at a glance.</li>
            <li>Open the anatomy section only when you need to understand how companion tones are derived.</li>
            <li>Open a family accordion when you need the exact token names, swatches, defaults, and formulas.</li>
        </ul>
    @endpaper

    @paper(['padding' => 4, 'classList' => ['u-margin__bottom--5']])
        <span class="color-system-kicker">At a glance</span>
        @typography(['element' => 'h2', 'variant' => 'h3', 'classList' => ['color-system-section-heading']])
            Read the system without opening every token group
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
        <span class="color-system-kicker">Token anatomy</span>
        @typography(['element' => 'h2', 'variant' => 'h3', 'classList' => ['color-system-section-heading']])
            The derivation rules are available when you need them
        @endtypography

        @accordion([
            'spacedSections' => true,
            'list' => $anatomyItems,
            'classList' => ['color-system-accordion'],
        ])
        @endaccordion
    @endpaper

    @foreach($colorGroups as $group)
        @paper(['padding' => 4, 'classList' => ['u-margin__bottom--5'], 'attributeList' => ['id' => $group['id']]])
            <span class="color-system-kicker">{{ $group['summary'] }}</span>
            @typography(['element' => 'h2', 'variant' => 'h3', 'classList' => ['color-system-section-heading']])
                {{ $group['title'] }}
            @endtypography

            @typography(['element' => 'p', 'variant' => 'body', 'classList' => ['u-margin__bottom--3']])
                {{ $group['description'] }}
            @endtypography

            @php
                $accordionItems = array_map(static function (array $family) use ($renderFamilyContent): array {
                    $base = $family['base'];
                    return [
                        'heading' => $base['label'] . ' · ' . $base['var'],
                        'content' => $renderFamilyContent($family),
                    ];
                }, $group['families']);
            @endphp

            @accordion([
                'spacedSections' => true,
                'list' => $accordionItems,
                'classList' => ['color-system-accordion'],
            ])
            @endaccordion
        @endpaper
    @endforeach

    @paper(['padding' => 4, 'classList' => ['u-margin__bottom--5', 'color-system-palette-section'], 'attributeList' => ['id' => 'brand-palette']])
        <span class="color-system-kicker">Optional accent slots</span>
        @typography(['element' => 'h2', 'variant' => 'h3', 'classList' => ['color-system-section-heading']])
            Brand Palette
        @endtypography

        @typography(['element' => 'p', 'variant' => 'body', 'classList' => ['u-margin__bottom--3']])
            The ten palette slots are intentionally empty by default. Fill them when a project needs campaign, department, or seasonal accent families without redefining the core brand colors.
        @endtypography

        <div class="color-system-palette-grid u-margin__bottom--3">
            @for($i = 1; $i <= 10; $i++)
                <article class="color-system-palette-card" data-palette-card="{{ $i }}">
                    <div class="color-system-palette-card__swatch" data-palette-swatch="{{ $i }}" style="background: var(--color--palette-{{ $i }}); color: var(--color--palette-{{ $i }}-contrast, var(--color--surface-contrast));">
                        <span class="color-system-palette-card__token">--color--palette-{{ $i }}</span>
                        <span class="color-system-base-swatch__meta">Palette {{ $i }} · transparent by default</span>
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

    <script>
        (function() {
            var paletteSection = document.querySelector('.color-system-palette-section');

            if (!paletteSection) {
                return;
            }

            var paletteCards = Array.from(paletteSection.querySelectorAll('[data-palette-card]'));
            var visibleCards = 0;

            paletteCards.forEach(function(card) {
                var swatch = card.querySelector('[data-palette-swatch]');

                if (!swatch) {
                    return;
                }

                var backgroundColor = window.getComputedStyle(swatch).backgroundColor;
                var isTransparent = backgroundColor === 'rgba(0, 0, 0, 0)' || backgroundColor === 'transparent';

                if (isTransparent) {
                    card.hidden = true;
                    return;
                }

                visibleCards += 1;
            });

            if (visibleCards === 0) {
                paletteSection.hidden = true;
            }
        })();
    </script>

    @paper(['padding' => 4])
        <span class="color-system-kicker">Editing rules</span>
        @typography(['element' => 'h2', 'variant' => 'h3', 'classList' => ['color-system-section-heading']])
            Guidance stays available without taking over the page
        @endtypography

        @accordion([
            'spacedSections' => true,
            'list' => $guidanceItems,
            'classList' => ['color-system-accordion'],
        ])
        @endaccordion
    @endpaper
@stop