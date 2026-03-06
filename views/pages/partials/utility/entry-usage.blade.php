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
            // Prepare modifier options for code output
            $modifierOptions = [];
            foreach ($entryMods as $modKey => $modValues) {
                $options = array_values(array_filter(array_map('trim', explode(',', $modValues))));
                foreach ($options as $option) {
                    $modifierOptions[] = $option;
                }
            }
        @endphp
        @paper(['padding' => 3, 'classList' => ['u-margin__bottom--4']])
        @code(['language' => 'css', 'content' => ''])
/* Base class */
{{ e($entryFormat) }} {}

/* Modifiers */
@foreach($modifierOptions as $option)
{{ e($entryFormat) }}--{{ e($option) }} {}
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
