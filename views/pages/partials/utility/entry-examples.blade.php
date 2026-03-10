@if(!empty($entryExamples))
    @typography(['variant' => 'h3', 'element' => 'h3', 'classList' => ['u-margin__top--4', 'u-margin__bottom--2']])
        Examples
    @endtypography

    @foreach($entryExamples as $example)
        @php
            $exampleView        = is_string($example) ? $example : ($example['view'] ?? null);
            $exampleCss         = is_array($example['css'] ?? null) ? $example['css'] : [];
            $exampleTitle       = is_string($example['title'] ?? null) ? $example['title'] : null;
            $exampleDescription = is_string($example['description'] ?? null) ? $example['description'] : null;
        @endphp

        @if($exampleTitle || $exampleDescription)
            <article class="u-margin__bottom--2 u-margin__top--4">
                @if($exampleTitle)
                    @typography(['variant' => 'h4', 'element' => 'h4'])
                        {{ $exampleTitle }}
                    @endtypography
                @endif
                @if($exampleDescription)
                    @typography(['variant' => 'body', 'element' => 'p'])
                        {{ $exampleDescription }}
                    @endtypography
                @endif
            </article>
        @endif

        @if($exampleView)
            @foreach($exampleCss as $cssUrl)
                <link rel="stylesheet" href="{{ $cssUrl }}">
            @endforeach

            @php
                $renderView = static function (string $viewPath, array $viewData = []) use ($__env): string {
                    return $__env->make($viewPath, $viewData)->render();
                };

                $exampleTabContent  = $__env->make($exampleView, get_defined_vars())->render();
                $htmlSourceCode     = e(\HbgStyleGuide\Helper\ParseString::tidyHtml($exampleTabContent));
                $htmlCodeTemplate   = $renderView('layout.partials.doc.tab-code', ['language' => 'html']);
                $htmlCodeTabContent = str_replace('__CODE_PLACEHOLDER__', $htmlSourceCode, $htmlCodeTemplate);
            @endphp

            @paper(['padding' => 0, 'classList' => ['u-margin__bottom--4']])
                @tabs(['tabs' => [
                    ['title' => 'Example', 'content' => $exampleTabContent],
                    ['title' => 'HTML',    'content' => $htmlCodeTabContent],
                ]])
                @endtabs
            @endpaper
        @endif
    @endforeach

@elseif($entryFormat && !empty($entryMods))
    @php
        $hasDefaultModifier = array_key_exists('default', $entryMods)
            && trim((string) $entryMods['default']) === '';

        $composeClassName = static function (string $format, array $placeholderKeys, array $values): string {
            $className = $format;

            foreach ($placeholderKeys as $index => $key) {
                $value = (string) ($values[$index] ?? '');
                $token = '{' . $key . '}';

                if ($value === '') {
                    $pattern = '/(?:--|__|-|_)?' . preg_quote($token, '/') . '/';
                    $className = preg_replace($pattern, '', $className) ?? $className;
                    continue;
                }

                $className = str_replace($token, $value, $className);
            }

            $className = preg_replace('/(?:--|__|-|_)?\{[a-zA-Z0-9_]+\}/', '', $className) ?? $className;
            $className = preg_replace('/(--|__|-|_)+$/', '', $className) ?? $className;

            return $className;
        };

        $previewSelects = [];
        foreach ($entryMods as $modKey => $modValues) {
            $options = array_values(array_filter(array_map('trim', explode(',', $modValues))));
            if (!empty($options)) {
                $previewSelects[$modKey] = $options;
            }
        }
    @endphp

    @if(!empty($previewSelects))
        @typography(['variant' => 'h3', 'element' => 'h3', 'classList' => ['u-margin__top--4', 'u-margin__bottom--2']])
            Preview
        @endtypography

        @php
            $renderView = static function (string $viewPath, array $viewData = []) use ($__env): string {
                return $__env->make($viewPath, $viewData)->render();
            };

            $previewTabContent = $__env->make('pages.partials.utility.entry-examples-preview', get_defined_vars())->render();

            $cssFormat = e($entryFormat);
            preg_match_all('/\{(\w+)\}/', $entryFormat, $placeholderMatches);
            $placeholderKeys = $placeholderMatches[1];

            $modifierClasses = [];
            if (!empty($placeholderKeys)) {
                $valueArrays = [];
                foreach ($placeholderKeys as $key) {
                    $valueArrays[] = isset($entryMods[$key])
                        ? array_values(array_map('trim', explode(',', $entryMods[$key])))
                        : [];
                }

                $combinations = [[]];
                foreach ($valueArrays as $values) {
                    $newCombinations = [];
                    foreach ($combinations as $combo) {
                        foreach ($values as $value) {
                            $newCombinations[] = array_merge($combo, [$value]);
                        }
                    }
                    $combinations = $newCombinations;
                }

                foreach ($combinations as $combo) {
                    $modifierClasses[] = $composeClassName($entryFormat, $placeholderKeys, $combo);
                }

                if ($hasDefaultModifier) {
                    $defaultValues = array_fill(0, count($placeholderKeys), '');
                    $modifierClasses[] = $composeClassName($entryFormat, $placeholderKeys, $defaultValues);
                }
            } else {
                foreach ($entryMods as $modValues) {
                    foreach (array_values(array_map('trim', explode(',', $modValues))) as $option) {
                        if ($option === '') {
                            $modifierClasses[] = rtrim($entryFormat, '-_');
                            continue;
                        }

                        $modifierClasses[] = rtrim($entryFormat, '-_') . '--' . $option;
                    }
                }

                if ($hasDefaultModifier) {
                    $modifierClasses[] = rtrim($entryFormat, '-_');
                }
            }

            $modifierClasses = array_values(array_unique(array_filter($modifierClasses, static fn(string $class): bool => $class !== '')));
            if ($hasDefaultModifier) {
                $defaultClass = !empty($placeholderKeys)
                    ? $composeClassName($entryFormat, $placeholderKeys, array_fill(0, count($placeholderKeys), ''))
                    : rtrim($entryFormat, '-_');

                if ($defaultClass !== '') {
                    $modifierClasses = array_values(array_filter($modifierClasses, static fn(string $class): bool => $class !== $defaultClass));
                    array_unshift($modifierClasses, $defaultClass);
                }
            }

            $cssLines = "/* Format */\n{$cssFormat} {}\n\n/* Examples & modifiers */\n";
            foreach ($modifierClasses as $class) {
                $cssLines .= e($class) . " {}\n";
            }

            $cssCodeTemplate   = $renderView('layout.partials.doc.tab-code', ['language' => 'css']);
            $cssCodeTabContent = str_replace('__CODE_PLACEHOLDER__', e($cssLines), $cssCodeTemplate);
        @endphp

        @paper(['padding' => 0, 'classList' => ['u-margin__bottom--4']])
            @tabs(['tabs' => [
                ['title' => 'Preview', 'content' => $previewTabContent],
                ['title' => 'CSS',     'content' => $cssCodeTabContent],
            ]])
            @endtabs
        @endpaper

    @endif
@endif
