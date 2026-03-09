<div
    data-modifier-preview
    data-format="{{ e($entryFormat) }}"
    class="u-display--flex u-flex-direction--column u-gap-4 u-padding--3"
>
    <div class="u-display--flex u-gap-4 u-flex-wrap--wrap u-align-items--flex-end">
        @foreach($previewSelects as $modKey => $options)
            @select([
                'label' => $modKey,
                'id' => 'mod-' . e($entryFormat) . '-' . $modKey,
                'options' => array_combine($options, $options),
                'selectAttributeList' => ['data-modifier-key' => $modKey],
            ])
            @endselect
        @endforeach
    </div>

    <div
        data-preview-element
        data-base-class="u-padding--4"
        class="u-padding--4"
        style="outline: 2px dashed currentColor;
        outline-offset: 4px;
        min-height: 5rem;
        margin: 6px;"
    >
        Preview
    </div>
</div>
