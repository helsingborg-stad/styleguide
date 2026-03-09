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
            // Detect {key} placeholders in format
            preg_match_all('/\{(\w+)\}/', $entryFormat, $placeholderMatches);
            $placeholderKeys = $placeholderMatches[1];

            if (!empty($placeholderKeys)) {
                // Build value arrays for each placeholder key
                $valueArrays = [];
                foreach ($placeholderKeys as $key) {
                    $valueArrays[] = isset($entryMods[$key])
                        ? array_values(array_filter(array_map('trim', explode(',', $entryMods[$key]))))
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
                    $class = $entryFormat;
                    foreach ($placeholderKeys as $i => $key) {
                        $class = str_replace('{' . $key . '}', $combo[$i], $class);
                    }
                    $modifierOptions[] = $class;
                }
                $hasPlaceholders = true;
            } else {
                // Fallback: append modifier values to format with --
                $modifierOptions = [];
                foreach ($entryMods as $modValues) {
                    foreach (array_values(array_filter(array_map('trim', explode(',', $modValues)))) as $option) {
                        $modifierOptions[] = $option;
                    }
                }
                $hasPlaceholders = false;
            }
        @endphp
        @paper(['padding' => 3, 'classList' => ['u-margin__bottom--4']])
        @code(['language' => 'css', 'content' => ''])
/* Format */
{{ e($entryFormat) }}

/* Examples */
@foreach($modifierOptions as $option)
@if($hasPlaceholders)
{{ e($option) }} {}
@else
{{ e($entryFormat) }}--{{ e($option) }} {}
@endif
@endforeach
        @endcode
        @endpaper
    @endif

    @if(!empty($modifierRows))
        @table([
            'headings'     => ['Modifier', 'Values', 'Description'],
            'list'         => $modifierRows,
            'includePaper' => false,
            'classList'    => ['u-margin__top--2'],
        ])
        @endtable
    @endif

    @if($entryResp)
        @typography(['element' => 'p', 'variant' => 'caption', 'classList' => ['u-margin__top--2']])
            Supports responsive suffix (e.g. {{$entryFormat}}@{sm, md, lg}).
        @endtypography
    @endif
@endif
