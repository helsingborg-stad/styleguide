@if($entryFormat || !empty($entryMods))
    @php
        $modifierRows = [];
        foreach ($entryMods as $modKey => $modValues) {
            $modifierRows[] = ['columns' => [
                $modKey,
                $modValues,
                $entryDesc[$modKey] ?? '-',
            ]];
        }
    @endphp

    @typography(['variant' => 'h3', 'element' => 'h3', 'classList' => ['u-margin__top--4', 'u-margin__bottom--2']])
        Usage
    @endtypography

    @if($entryFormat)
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

            // Detect {key} placeholders in format
            preg_match_all('/\{(\w+)\}/', $entryFormat, $placeholderMatches);
            $placeholderKeys = $placeholderMatches[1];

            if (!empty($placeholderKeys)) {
                // Build value arrays for each placeholder key
                $valueArrays = [];
                foreach ($placeholderKeys as $key) {
                    $valueArrays[] = isset($entryMods[$key])
                        ? array_values(array_map('trim', explode(',', $entryMods[$key])))
                        : [];
                }
                // Cartesian product of all value arrays
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
                // Substitute placeholders to produce full class names
                $modifierOptions = [];
                foreach ($combinations as $combo) {
                    $class = $composeClassName($entryFormat, $placeholderKeys, $combo);
                    $modifierOptions[] = $class;
                }

                if ($hasDefaultModifier) {
                    $defaultValues = array_fill(0, count($placeholderKeys), '');
                    $modifierOptions[] = $composeClassName($entryFormat, $placeholderKeys, $defaultValues);
                }

                $modifierOptions = array_values(array_unique(array_filter($modifierOptions, static fn(string $class): bool => $class !== '')));
                if ($hasDefaultModifier) {
                    $defaultValues = array_fill(0, count($placeholderKeys), '');
                    $defaultClass = $composeClassName($entryFormat, $placeholderKeys, $defaultValues);
                    if ($defaultClass !== '') {
                        $modifierOptions = array_values(array_filter($modifierOptions, static fn(string $class): bool => $class !== $defaultClass));
                        array_unshift($modifierOptions, $defaultClass);
                    }
                }
                $hasPlaceholders = true;
            } else {
                // Fallback: append modifier values to format with --
                $modifierOptions = [];
                foreach ($entryMods as $modValues) {
                    foreach (array_values(array_map('trim', explode(',', $modValues))) as $option) {
                        if ($option === '') {
                            $modifierOptions[] = rtrim($entryFormat, '-_');
                            continue;
                        }

                        $modifierOptions[] = rtrim($entryFormat, '-_') . '--' . $option;
                    }
                }

                if ($hasDefaultModifier) {
                    $modifierOptions[] = rtrim($entryFormat, '-_');
                }

                $modifierOptions = array_values(array_unique(array_filter($modifierOptions, static fn(string $class): bool => $class !== '')));
                if ($hasDefaultModifier) {
                    $defaultClass = rtrim($entryFormat, '-_');
                    if ($defaultClass !== '') {
                        $modifierOptions = array_values(array_filter($modifierOptions, static fn(string $class): bool => $class !== $defaultClass));
                        array_unshift($modifierOptions, $defaultClass);
                    }
                }
                $hasPlaceholders = false;
            }
        @endphp
        @paper(['padding' => 3, 'classList' => ['u-margin__bottom--4']])
        @code(['language' => 'css', 'content' => ''])
/* Format */
{{ e($entryFormat) }} 

/* Examples & modifiers */
@foreach($modifierOptions as $option)
@if($hasPlaceholders)
{{ e($option) }} {}
@else
{{ e($option) }} {}
@endif
@endforeach
        @endcode
        @endpaper
    @endif

    @if(!empty($modifierRows))
        @table([
            'headings'     => ['Modifier', 'Values', 'Description'],
            'list'         => $modifierRows,
            'includePaper' => false
        ])
        @endtable
    @endif

    @if($entryResp)
        @typography(['element' => 'p', 'variant' => 'caption', 'classList' => ['u-margin__top--2']])
            Supports responsive suffix (e.g. {{$entryFormat}}@{sm, md, lg}).
        @endtypography
    @endif
@endif
