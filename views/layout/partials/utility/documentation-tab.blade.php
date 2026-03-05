<div>
    @if ($format)
        <p class="u-margin__bottom--2">Format: <code>{{ $format }}</code></p>
    @endif

    @if ($responsive && $format)
        <p class="u-margin__bottom--2">This utlitiy is responsive and can be used like <code>class="{{ $format }}@md"</code></p>
    @endif

    @table([
        'headings' => ['Modifiers', 'Description', 'Values'],
        'list' => $documentationRows,
        'includePaper' => false
    ])
    @endtable
</div>
