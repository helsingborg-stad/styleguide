<section id="docblock-{{rand(0,99999)}}" class="example">
    @if($examples)
        @foreach($examples as $example)
            
            <article class="article u-margin__bottom--2 u-margin__top--10">

                @typography([
                    'variant' => 'h3',
                    'element' => 'h3'
                ])
                    @if($example['description']['heading'])
                        {{$example['description']['heading']}}
                    @endif
                @endtypography

                @if(isset($example['description']['description']) && !empty($example['description']['description']))
                    @typography([
                        'variant' => 'body',
                        'element' => 'p'
                    ])
                        {{$example['description']['description']}}
                    @endtypography
                @endif

            </article>


            @paper(['padding' => 0, 'classList' => ['u-margin__bottom--4']])
                @php
                    $htmlSourceCode = e(\HbgStyleGuide\Helper\ParseString::tidyHtml($example['html']['code']));
                    $bladeSourceCode = e($example['blade']['code']);

                    $renderView = static function (string $viewPath, array $viewData = []) use ($__env): string {
                        return $__env->make($viewPath, $viewData)->render();
                    };

                    $exampleTabContent = $__env->make($example['component'], get_defined_vars())->render();
                    $htmlCodeTemplate = $renderView('layout.partials.doc.tab-code', ['language' => 'html']);
                    $htmlCodeTabContent = str_replace('__CODE_PLACEHOLDER__', $htmlSourceCode, $htmlCodeTemplate);
                    $bladeCodeTemplate = $renderView('layout.partials.doc.tab-code', ['language' => 'php']);
                    $bladeCodeTabContent = str_replace('__CODE_PLACEHOLDER__', $bladeSourceCode, $bladeCodeTemplate);
                @endphp

                @php
                    $tabs = [
                        [
                            'title' => 'Example',
                            'content' => $exampleTabContent,
                        ],
                        [
                            'title' => 'HTML',
                            'content' => $htmlCodeTabContent,
                        ],
                        [
                            'title' => 'Blade',
                            'content' => $bladeCodeTabContent,
                        ],
                    ];
                @endphp

                @tabs([
                    'tabs' => $tabs,
                ])
                @endtabs

            @endpaper
        @endforeach

    @else
        @paper(['padding' => 3])

            <div class="markup-preview">
                {!! $slot !!}
            </div>

        @endpaper
    @endif

    @if(isset($settings) && isset($slug) && !empty($slug))
        @if(isset($displayParams) && !empty($displayParams))
            @php
                $paramRows = [];
                foreach($settings as $key => $item) {
                    if(is_array($item) || is_object($item)) {
                        $defaultVal = json_encode($item);
                    } elseif(is_bool($item)) {
                        $defaultVal = $item ? 'true' : 'false';
                    } else {
                        $defaultVal = (string) $item;
                    }
                    $paramRows[] = [
                        'columns' => [
                            $key,
                            $defaultVal,
                            gettype($item),
                            isset($available[$key]) ? $available[$key] : '-',
                            isset($description[$key]) ? $description[$key] : '-',
                        ]
                    ];
                }
                $paramRows[] = ['columns' => ['id', '', 'string', '-', 'The DOM id of the component.']];
                $paramRows[] = ['columns' => ['classList', '[]', 'array', '-', 'Array containing wrapping classes array']];
                $paramRows[] = ['columns' => ['attributeList', '[]', 'array', '-', 'Array containing keys and values rendered as attributes']];
            @endphp

            <div class="u-margin__top--10">
                @table([
                    'title'        => 'Parameters (Blade)',
                    'headings'     => ['Key', 'Default value', 'Type', 'Available values', 'Description'],
                    'list'         => $paramRows,
                    'includePaper' => false,
                ])
                @endtable
            </div>
        @endif

        @if(isset($cssParameters) && !empty($cssParameters))
            @php
                $cssParamRows = [];
                foreach($cssParameters as $item) {
                    $cssParamRows[] = [
                        'columns' => [
                            $item['key'] ?? '-',
                            $item['defaultValue'] ?? '',
                            $item['type'] ?? '-',
                            $item['availableValues'] ?? '-',
                            $item['description'] ?? '-',
                        ]
                    ];
                }
            @endphp

            <div class="u-margin__top--10">
                @table([
                    'title'        => 'Parameters (CSS)',
                    'headings'     => ['Key', 'Default value', 'Type', 'Available values', 'Description'],
                    'list'         => $cssParamRows,
                    'includePaper' => false,
                ])
                @endtable
            </div>
        @endif
    @endif
    

    
    @if(isset($modifiers) && !empty($modifiers))
        @paper(['padding' => 3, 'classList' => ['u-margin__top--10']])
            <p>Modifiers can be appended to the base class and should, when needed, be added to the classList.</p>

            @if(isset($modifiersExample))
                <p>Example usage:</p>
                @code(['heading' => 'Example', 'language' => 'php', 'content' => ""]) {{$modifiersExample}} @endcode
            @endif

            @php
                $modifierRows = [];
                foreach($modifiers as $key => $item) {
                    $modifierRows[] = ['columns' => [$key, $item]];
                }
            @endphp

            @table([
                'title'        => 'Modifiers',
                'headings'     => ['Modifier', 'Description'],
                'list'         => $modifierRows,
                'includePaper' => false,
            ])
            @endtable
        @endpaper
    @endif

    @if(isset($exampleMetadataSections) && !empty($exampleMetadataSections))
        @foreach($exampleMetadataSections as $section)
            @paper(['padding' => 3, 'classList' => ['u-margin__top--10']])
                @if(!empty($section['title']))
                    @typography(['variant' => 'h3', 'element' => 'h3'])
                        {{ $section['title'] }}
                    @endtypography
                @endif

                @if(!empty($section['description']))
                    @typography(['variant' => 'body', 'element' => 'p'])
                        {{ $section['description'] }}
                    @endtypography
                @endif

                @php
                    $availableRows = [];
                    foreach (($section['available'] ?? []) as $modifier => $modifierData) {
                        $modifierDescription = is_array($modifierData) ? ($modifierData['description'] ?? '-') : '-';
                        $allowedValues = is_array($modifierData) ? ($modifierData['allowedValues'] ?? '-') : '-';
                        $responsive = is_array($modifierData) && array_key_exists('responsive', $modifierData)
                            ? ($modifierData['responsive'] ? 'Yes' : 'No')
                            : '-';
                        $containerQuery = is_array($modifierData) && array_key_exists('containerQuery', $modifierData)
                            ? ($modifierData['containerQuery'] ? 'Yes' : 'No')
                            : '-';

                        $availableRows[] = [
                            'columns' => [
                                (string) $modifier,
                                is_string($modifierDescription) ? $modifierDescription : '-',
                                is_string($allowedValues) ? $allowedValues : '-',
                                $responsive,
                                $containerQuery,
                            ],
                        ];
                    }
                @endphp

                @if(!empty($availableRows))
                    @table([
                        'title'        => 'Available Modifiers',
                        'headings'     => ['Modifier', 'Description', 'Values', 'Responsive', 'Container Query'],
                        'list'         => $availableRows,
                        'includePaper' => false,
                    ])
                    @endtable
                @endif
            @endpaper
        @endforeach
    @endif
</section>
