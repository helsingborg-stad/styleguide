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

            @paper(['padding' => 3, 'classList' => ['u-margin__bottom--4']])
                @include($exampleView)
            @endpaper
        @endif
    @endforeach

@elseif($entryFormat && !empty($entryMods))
    @php
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

        @paper(['padding' => 3, 'classList' => ['u-margin__bottom--4']])
            <div
                data-modifier-preview
                data-format="{{ e($entryFormat) }}"
                class="u-display--flex u-flex-direction--column u-gap-4"
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
                    style="outline: 2px dashed currentColor; outline-offset: 4px; min-height: 5rem;"
                >
                    Preview
                </div>

                @code(['language' => 'css', 'content' => ''])
                    <span data-applied-class></span>
                @endcode
            </div>
        @endpaper

    @endif
@endif
