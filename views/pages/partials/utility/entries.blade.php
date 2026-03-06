@if(!empty($utilityEntryKeys ?? []) && !empty($slug ?? ''))
    @foreach(($utilityEntryKeys ?? []) as $utilityEntryKey)
        @php
            $entry         = ($utilityEntries ?? [])[$utilityEntryKey] ?? [];
            $entryTitle    = $entry['title'] ?? ucwords(str_replace(['-', '_'], ' ', $utilityEntryKey));
            $entrySummary  = is_array($entry['summary'] ?? null) ? $entry['summary'] : [];
            $entryContent  = is_string($entry['content'] ?? null) ? $entry['content'] : null;
            $entryFormat   = is_string($entry['format'] ?? null) ? $entry['format'] : null;
            $entryMods     = is_array($entry['modifiers'] ?? null) ? $entry['modifiers'] : [];
            $entryDesc     = is_array($entry['description'] ?? null) ? $entry['description'] : [];
            $entryResp     = (bool) ($entry['responsive'] ?? false);
            $entryExamples = ($utilityExamplesByEntry ?? [])[$utilityEntryKey] ?? [];
        @endphp

        @if(!$loop->first)
            @divider(['size' => 'full', 'classList' => ['u-margin__top--8', 'u-margin__bottom--8']])
            @enddivider
        @endif

        @typography(['variant' => 'h2', 'element' => 'h2', 'classList' => ['u-margin__bottom--2']])
            {{ $entryTitle }}
        @endtypography

        @if($entryContent)
            @typography(['element' => 'p', 'variant' => 'body', 'classList' => ['u-margin__bottom--4']])
                {{ $entryContent }}
            @endtypography
        @endif

        @foreach($entrySummary as $summaryLine)
            @typography(['element' => 'p', 'variant' => 'body', 'classList' => ['u-margin__bottom--2']])
                {{ $summaryLine }}
            @endtypography
        @endforeach

        {{-- Entry: Usage --}}
        @include('pages.partials.utility.entry-usage')

        {{-- Entry: Examples --}}
        @include('pages.partials.utility.entry-examples')
    @endforeach
@else
    @notice([
        'type' => 'warning',
        'message' => ['text' => 'No utility documentation is available right now.']
    ])
    @endnotice
@endif
