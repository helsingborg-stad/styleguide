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

        .color-system-color-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
            gap: 0.9rem;
            margin-top: 1.5rem;
        }

        .color-system-color-tile {
            appearance: none;
            border: 1px solid var(--color--surface-border);
            border-radius: calc(var(--border-radius, 1) * 0.5rem);
            background: var(--color--surface);
            color: var(--color--surface-contrast);
            cursor: pointer;
            display: grid;
            grid-template-rows: 96px auto;
            min-width: 0;
            overflow: hidden;
            padding: 0;
            text-align: left;
            text-decoration: none;
            transition:
                border-color 0.15s ease,
                box-shadow 0.15s ease,
                transform 0.15s ease;
        }

        .color-system-color-tile:hover,
        .color-system-color-tile:focus-visible {
            border-color: var(--color--primary);
            box-shadow: 0 0 0 2px color-mix(in srgb, var(--color--primary) 20%, transparent);
            outline: none;
            transform: translateY(-1px);
        }

        .color-system-color-tile__swatch {
            min-height: 96px;
            border-bottom: 1px solid var(--color--surface-border);
        }

        .color-system-color-tile__body {
            display: grid;
            gap: 0.2rem;
            min-width: 0;
            padding: 0.8rem;
        }

        .color-system-color-tile__name,
        .color-system-color-tile__token {
            display: block;
            overflow-wrap: anywhere;
        }

        .color-system-color-tile__name {
            font-weight: 700;
            line-height: 1.3;
        }

        .color-system-color-tile__token {
            color: var(--color--surface-contrast-muted);
            font-family: var(--font-family-code, monospace);
            font-size: 0.72rem;
            line-height: 1.4;
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

        .color-system-section-list {
            display: grid;
            gap: 1rem;
            margin-top: 1rem;
        }

        .color-system-section-card {
            border: 1px solid var(--color--surface-border);
            border-radius: calc(var(--border-radius, 1) * 0.5rem);
            background: var(--color--surface);
            padding: 1rem;
        }

        .color-system-section-card__heading {
            margin: 0 0 0.75rem;
            color: var(--color--surface-contrast);
            font-size: 1rem;
            line-height: 1.35;
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

        $colorFamilies = [];
        foreach ($colorGroups as $group) {
            foreach ($group['families'] as $family) {
                $colorFamilies[] = [
                    'group' => $group,
                    'family' => $family,
                    'tabIndex' => count($colorFamilies) + 1,
                ];
            }
        }

        $renderColorTile = static function (array $entry): string {
            $base = $entry['family']['base'];

            return '<a href="#color-system-details-tabs" class="color-system-color-tile" data-simulate-click="#color-system-details-tabs .c-tabs__button:nth-of-type(' . e((string) $entry['tabIndex']) . ')">'
                . '<span class="color-system-color-tile__swatch" style="background: var(' . e($base['var']) . ');"></span>'
                . '<span class="color-system-color-tile__body">'
                . '<span class="color-system-color-tile__name">' . e($base['label']) . '</span>'
                . '<span class="color-system-color-tile__token">' . e($base['var']) . '</span>'
                . '</span>'
                . '</a>';
        };

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

        $renderFamilyDetails = static function (array $entry) use ($renderFamilyContent): string {
            $base = $entry['family']['base'];
            $companions = $entry['family']['companions'];
            $derivedCount = count(array_filter($companions, static function (array $companion): bool {
                return ($companion['editable'] ?? false) === false;
            }));
            $derivedDescription = $derivedCount === 0
                ? 'No companion tokens in this family are generated.'
                : e((string) $derivedCount) . ' companion token' . ($derivedCount === 1 ? ' is' : 's are') . ' generated from the base color and its contrast color.';

            return '<div class="color-system-section-list">'
                . '<section class="color-system-section-card">'
                . '<span class="color-system-kicker">' . e($entry['group']['title']) . '</span>'
                . '<h3 class="color-system-section-card__heading">' . e($base['label']) . ' details</h3>'
                . '<p class="color-system-family-usage">' . e($entry['group']['description']) . '</p>'
                . '</section>'
                . '<section class="color-system-section-card">'
                . $renderFamilyContent($entry['family'])
                . '</section>'
                . '<section class="color-system-section-card">'
                . '<h3 class="color-system-section-card__heading">Derivation rules</h3>'
                . '<ul class="color-system-intro-list">'
                . '<li>Editable base and contrast values are set directly in the design token system.</li>'
                . '<li>' . $derivedDescription . '</li>'
                . '<li><strong>--color--border-mix-amount</strong> controls border and hover companion strength.</li>'
                . '<li><strong>--color--alt-mix-amount</strong> controls subtle fill companion strength.</li>'
                . '</ul>'
                . '</section>'
                . '</div>';
        };

        $detailTabs = array_map(static function (array $entry) use ($renderFamilyDetails): array {
            return [
                'title' => $entry['family']['base']['label'],
                'content' => $renderFamilyDetails($entry),
            ];
        }, $colorFamilies);
    @endphp

    @paper(['padding' => 4, 'classList' => ['u-margin__bottom--5'], 'attributeList' => ['id' => 'overview']])
        <span class="color-system-kicker">Color overview</span>
        @typography(['element' => 'h2', 'variant' => 'h3', 'classList' => ['color-system-section-heading']])
            Names and colors first
        @endtypography

        @typography(['element' => 'p', 'variant' => 'body'])
            Select a color to open its details below. The grid stays intentionally simple: label, token, and swatch.
        @endtypography

        <div class="color-system-color-grid">
            {!! implode('', array_map($renderColorTile, $colorFamilies)) !!}
        </div>
    @endpaper

    @paper(['padding' => 0, 'attributeList' => ['id' => 'color-system-details-tabs']])
        @tabs([
            'tabs' => $detailTabs,
        ])
        @endtabs
    @endpaper
@stop
