<section id="docblock-{{rand(0,99999)}}" class="example">
    @php
        $classesTabContent = null;
        $standardizedExampleContent = null;
        $customPreviewMarkup = null;
        $renderView = static function (string $viewPath, array $viewData = []) use ($__env): string {
            return $__env->make($viewPath, $viewData)->render();
        };

        if (isset($slot) && trim((string) $slot) !== '') {
            $customPreviewMarkup = (string) $slot;
        }
    @endphp

    @if(isset($settings))
        @php
            $documentationRows = [];
            foreach($settings as $key => $item) {
                $documentationRows[] = [
                    'columns' => [
                        $key,
                        isset($description[$key]) ? $description[$key] : '-',
                        isset($item) ? $item : '-',
                    ]
                ];
            }

            $classesTabContent = $renderView('layout.partials.utility.documentation-tab', [
                'format' => $format ?? null,
                'responsive' => $responsive ?? false,
                'documentationRows' => $documentationRows,
            ]);
        @endphp
    @endif

    @php
        $utilityClassOptions = [];
        $hasCustomPreview    = is_string($customPreviewMarkup) && trim($customPreviewMarkup) !== '';
        $baseFormat          = isset($format) && is_string($format) ? trim($format) : '';
        $baseFormat          = ltrim($baseFormat, '.');

        if ($baseFormat !== '' && isset($settings) && is_array($settings) && !empty($settings)) {
            $modifierKeys = [];
            $modifierValues = [];

            foreach ($settings as $modifierKey => $modifierValueString) {
                if (!is_string($modifierKey) || $modifierKey === '') {
                    continue;
                }

                if (!is_string($modifierValueString) || trim($modifierValueString) === '') {
                    continue;
                }

                $values = array_values(array_filter(array_map('trim', explode(',', $modifierValueString)), static fn(string $value): bool => $value !== ''));
                if (empty($values)) {
                    continue;
                }

                $modifierKeys[] = $modifierKey;
                $modifierValues[] = $values;
            }

            if (empty($modifierKeys)) {
                $utilityClassOptions[] = $baseFormat;
            } else {
                $maxOptions = 220;
                $combinations = [[]];

                foreach ($modifierValues as $values) {
                    $next = [];
                    foreach ($combinations as $combo) {
                        foreach ($values as $value) {
                            $newCombo = $combo;
                            $newCombo[] = $value;
                            $next[] = $newCombo;
                            if (count($next) >= $maxOptions) {
                                break 2;
                            }
                        }
                    }
                    $combinations = $next;
                }

                foreach ($combinations as $combination) {
                    $candidateClass = $baseFormat;
                    foreach ($modifierKeys as $index => $modifierKey) {
                        $value = $combination[$index] ?? '';
                        $candidateClass = str_replace('{' . $modifierKey . '}', $value, $candidateClass);
                        $candidateClass = str_replace($modifierKey, $value, $candidateClass);
                    }

                    if (preg_match('/[a-z_][a-z0-9_-]*/i', $candidateClass) !== 1) {
                        continue;
                    }

                    if (strpos($candidateClass, '{') !== false || strpos($candidateClass, '}') !== false) {
                        continue;
                    }

                    $utilityClassOptions[] = trim($candidateClass);
                }
            }

            $utilityClassOptions = array_values(array_unique(array_filter($utilityClassOptions, static fn(string $value): bool => $value !== '')));
        }

        if (!$hasCustomPreview && !empty($utilityClassOptions)) {
            $exampleId = 'utility-example-' . rand(1000, 99999);
            $basePreviewClasses = 'u-padding--4 u-color__bg--default u-rounded';
            $selectComponentOptions = [];
            foreach ($utilityClassOptions as $utilityClassOption) {
                $selectComponentOptions[$utilityClassOption] = $utilityClassOption;
            }

            $standardizedExampleContent = $renderView('layout.partials.utility.example-tab', [
                'exampleId' => $exampleId,
                'basePreviewClasses' => $basePreviewClasses,
                'selectComponentOptions' => $selectComponentOptions,
            ]);
        }
    @endphp

    @if ((is_string($standardizedExampleContent) && trim($standardizedExampleContent) !== '') || (is_string($customPreviewMarkup) && trim($customPreviewMarkup) !== ''))
        @paper(['padding' => 0, 'classList' => ['u-margin__bottom--4']])
            @php
                $exampleTabContent = is_string($standardizedExampleContent) && trim($standardizedExampleContent) !== ''
                    ? $standardizedExampleContent
                    : (string) $customPreviewMarkup;
            @endphp

            @php

                $tabs = [
                    [
                        'title' => 'Example',
                        'content' => $exampleTabContent,
                    ]
                ];

                if (is_string($classesTabContent) && $classesTabContent !== '') {
                    $tabs[] = [
                        'title' => 'Documentation',
                        'content' => $classesTabContent,
                    ];
                }
            @endphp

            @tabs([
                'tabs' => $tabs,
            ])
            @endtabs
        @endpaper
    @elseif(is_string($classesTabContent) && $classesTabContent !== '')
        @paper(['padding' => 0, 'classList' => ['u-margin__bottom--4']])
            @tabs([
                'tabs' => [
                    [
                        'title' => 'Documentation',
                        'content' => $classesTabContent,
                    ],
                ],
            ])
            @endtabs
        @endpaper
    @endif
</section>