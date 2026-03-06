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
        @code(['language' => 'css', 'content' => $entryFormat])
        @endcode
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
