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
            ])
            @endtable
        </div>

        @php
            $classesTabContent = ob_get_clean();
        @endphp
    @endif

    @if (strlen($slot) > 0)
        @paper(['padding' => 0, 'classList' => ['u-margin__bottom--4']])
            @php
                $htmlSourceCode = e(
                    \HbgStyleGuide\Helper\ParseString::tidyHtml($slot)
                );

                ob_start();
            @endphp

            @code(['language' => 'html', 'content' => ''])
                __HTML_CODE_PLACEHOLDER__
            @endcode

            @php
                $htmlCodeTabContent = str_replace('__HTML_CODE_PLACEHOLDER__', $htmlSourceCode, ob_get_clean());

                $tabs = [
                    [
                        'title' => 'Example',
                        'content' => $slot,
                    ],
                    [
                        'title' => 'HTML',
                        'content' => $htmlCodeTabContent,
                    ],
                ];

                if (is_string($classesTabContent) && $classesTabContent !== '') {
                    $tabs[] = [
                        'title' => 'Classes',
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