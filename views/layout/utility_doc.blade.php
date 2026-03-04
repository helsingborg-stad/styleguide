<section id="docblock-{{rand(0,99999)}}" class="example">
   
    <article class="article u-margin__bottom--2">
        @php
            $utilityLabel = isset($viewDoc['config'])
                ? ucwords(str_replace(['-', '_'], ' ', (string) $viewDoc['config']))
                : 'Utility';

            $descriptionText = null;
            if (isset($summary) && is_string($summary) && trim($summary) !== '') {
                $descriptionText = $summary;
            } elseif (isset($description) && is_array($description)) {
                foreach ($description as $descriptionValue) {
                    if (is_string($descriptionValue) && trim($descriptionValue) !== '') {
                        $descriptionText = $descriptionValue;
                        break;
                    }
                }
            }

            if (!is_string($descriptionText) || trim($descriptionText) === '') {
                $descriptionText = $utilityLabel . ' utility examples.';
            }
        @endphp

        @typography([
            'variant' => 'body',
            'element' => 'p'
        ])
            {!! $descriptionText !!}
        @endtypography

    </article>

    @php
        $classesTabContent = null;
        $standardizedExampleContent = null;
        $customPreviewMarkup = null;
        if (isset($slot) && trim((string) $slot) !== '') {
            $customPreviewMarkup = (string) $slot;
        }
    @endphp

    @if(isset($settings))
        @php
            $classRows = [];
            foreach($settings as $key => $item) {
                $classRows[] = [
                    'columns' => [
                        $key,
                        isset($description[$key]) ? $description[$key] : '-',
                        isset($item) ? $item : '-',
                    ]
                ];
            }

            ob_start();
        @endphp

        <div>
            @if ($format)
                <p>Format: <code>{{ $format }}</code></p>
            @endif

            @if ($responsive && $format)
                <p>This utlitiy is responsive and can be used like <code>class="{{ $format }}@md"</code></p>
            @endif

            @table([
                'headings' => ['Modifiers', 'Description', 'Values'],
                'list' => $classRows,
                'includePaper' => false,
                'classList' => []
            ])
            @endtable
        </div>

        @php
            $classesTabContent = ob_get_clean();
        @endphp
    @endif

    @php
        $utilityClassOptions = [];
        $hasCustomPreview = is_string($customPreviewMarkup) && trim($customPreviewMarkup) !== '';
        $baseFormat = isset($format) && is_string($format) ? trim($format) : '';
        $baseFormat = ltrim($baseFormat, '.');

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

            ob_start();
    @endphp

            <div class="u-margin__bottom--2">
                <div id="{{ $exampleId }}-select-wrapper">
                    @select([
                        'label' => 'Apply utility class',
                        'placeholder' => 'Not applied',
                        'preselected' => '',
                        'options' => $selectComponentOptions,
                    ])
                    @endselect
                </div>
            </div>

            <div class="u-margin__bottom--2">
                <span>Current class:</span>
                <code id="{{ $exampleId }}-current">Not applied</code>
            </div>

            <div class="u-clearfix u-padding--3" style="overflow: hidden; margin: calc(var(--base) * -3); min-height: 100px; position: relative; contain: layout paint;">
                <div id="{{ $exampleId }}-target" class="{{ $basePreviewClasses }}" style="transition: all 0.3s ease;">Utility preview element</div>
            </div>

            <script>
                (function () {
                    var selectWrapperElement = document.getElementById('{{ $exampleId }}-select-wrapper');
                    var selectElement = selectWrapperElement ? selectWrapperElement.querySelector('select') : null;
                    var targetElement = document.getElementById('{{ $exampleId }}-target');
                    var currentClassElement = document.getElementById('{{ $exampleId }}-current');
                    if (!selectElement || !targetElement || !currentClassElement) {
                        return;
                    }

                    var baseClasses = '{{ $basePreviewClasses }}';

                    var applySelectedClass = function applySelectedClass() {
                        var selectedClass = String(selectElement.value || '').trim();
                        targetElement.className = selectedClass === '' ? baseClasses : baseClasses + ' ' + selectedClass;
                        currentClassElement.textContent = selectedClass === '' ? 'Not applied' : selectedClass;
                    };

                    var updateContentWithSelectedClass = function updateContentWithSelectedClass() {
                        var selectedClass = String(selectElement.value || '').trim();
                        targetElement.textContent = selectedClass === '' ? 'Not applied' : selectedClass;
                    }; 

                    selectElement.addEventListener('change', updateContentWithSelectedClass);
                    selectElement.addEventListener('change', applySelectedClass);
                    applySelectedClass();
                    updateContentWithSelectedClass();
                })();
            </script>

    @php
            $standardizedExampleContent = ob_get_clean();
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
                        'title' => 'Classes',
                        'content' => $classesTabContent,
                    ],
                ],
            ])
            @endtabs
        @endpaper
    @endif
</section>