<section id="docblock-{{rand(0,99999)}}" class="example">

    @if(isset($summary))
        @paper(['padding' => 3, 'classList' => ['u-margin__bottom--4']])
            @typography([
                'variant' => 'h3',
                'element' => 'h3'
            ])
                Summary
            @endtypography

            @typography([
                'variant' => 'body',
                'element' => 'p'
            ])
                {!! $summary !!}
            @endtypography
        @endpaper
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
            @endphp

            @tabs([
                'tabs' => $tabs,
            ])
            @endtabs
        @endpaper
    @endif

    @if(isset($settings))
        @paper(['padding' => 3, 'classList' => ['u-margin__top--10']])
            @typography([
                'variant' => 'h3',
                'element' => 'h3'
            ])
                Classes
            @endtypography

            @if ($format)
                <p>Format: <code>{{ $format }}</code></p>
            @endif

            @if ($responsive && $format)
                <p>This utlitiy is responsive and can be used like <code>class="{{ $format }}@md"</code></p>
            @endif

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
            @endphp

            @table([
                'headings' => ['Modifiers', 'Description', 'Values'],
                'list' => $classRows,
                'includePaper' => false,
            ])
            @endtable
        @endpaper
    @endif
</section>