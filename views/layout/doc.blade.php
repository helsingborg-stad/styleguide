<section id="docblock-{{rand(0,99999)}}" class="example">
@if($examples)
        <div class="grid">
        @foreach($examples as $key => $example)

            @if(isset($example['description']['grid']) && !empty($example['description']['grid']))
                @php
                      $componentDesc = [
                        '--component-description-area'
                      ];

                      $codeArea = [
                        'c-paper--component-code-area-grid'
                      ];
                @endphp
            @else
                @php
                    $componentDesc = [
                        'c-paper--component-description-area',
                        'c-paper--component-description-area-full'
                    ];

                    $codeArea = [
                        'c-paper--component-code-area-full'
                    ];

                    $example['description']['grid'] = 'grid-md-12';
                @endphp
            @endif

            <div class="{{$example['description']['grid']}}">

                @paper([
                    'padding' => $paper['containerPadding'],
                    'transparent' => $paper['transparencyContainer']
                ])

                    <div class="u-margin__bottom--4">
                        @typography([
                            'variant' => "h3",
                            'element' => "h3"
                        ])
                            @if($example['description']['heading'])
                                {{$example['description']['heading']}}
                            @endif
                        @endtypography

                        @typography([
                            'variant' => "h4",
                            'element' => "h4",
                            'classList' => []
                        ])
                            {{$example['description']['subHeading']}}
                        @endtypography

                        @if(isset($example['description']['description']) && !empty($example['description']['description']))
                            @typography([
                                "variant" => "body",
                                "element" => "p"
                            ])
                                {{$example['description']['description']}}
                            @endtypography
                        @endif
                    </div>

                    <div class="u-padding--4" style="border: 2px dashed var(--color-code-button,var(--color-default-darker,#3d3d3d)); border-bottom: none;">
                        @include($example['component'])
                    </div>

                    <div class="d-code__toggle c-code__toggle">
                        @button([
                            'text' => 'HTML',
                            'color' => 'default',
                            'type' => 'basic',
                            'size' => 'md',
                            'icon' => 'code',
                            'toggle' => true,
                            'attributeList' => ['js-toggle-trigger' => $example['html']['id'], 'js-toggle-group' => $loop->index]
                        ])
                        @endbutton
                        @button([
                            'text' => 'Blade',
                            'color' => 'default',
                            'type' => 'basic',
                            'size' => 'md',
                            'icon' => 'code',
                            'toggle' => true,
                            'attributeList' => ['js-toggle-trigger' => $example['blade']['id'], 'js-toggle-group' => $loop->index]
                        ])
                        @endbutton
                    </div>

                    @code(['language' => 'html', 'content' => "", 'classList' => ['d-code', 'u-display--none'], 'attributeList' => ['js-toggle-item' => $example['html']['id'], 'js-toggle-class' => 'u-display--block', 'js-toggle-group' => $loop->index]])
                        {{ \HbgStyleGuide\Helper\ParseString::tidyHtml($example['html']['code'])}}
                    @endcode
                
                    @code(['language' => 'php', 'content' => "", 'classList' => ['d-code', 'u-display--none'], 'attributeList' => ['js-toggle-item' => $example['blade']['id'], 'js-toggle-class' => 'u-display--block', 'js-toggle-group' => $loop->index]])
                        {{$example['blade']['code']}}
                    @endcode
                @endpaper

            </div>
        @endforeach
        </div>

    @else
        @paper(['padding' => 3])

            <div class="markup-preview">
                {!! $slot !!}
            </div>

        @endpaper
    @endif

    @if(isset($settings) && isset($slug) && !empty($slug))
        @if(isset($displayParams) && !empty($displayParams))

            @paper(['padding' => 3, 'classList' => ['u-margin__top--10']])
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

        @endif
    @endif

    @endpaper


                @table([
                'title'        => 'Parameters',
                'headings'     => ['Key', 'Default value', 'Type', 'Available values', 'Description'],
                'list'         => $paramRows,
                'includePaper' => false,
            ])
            @endtable
            <small><strong>Settings location:</strong> {{$settingsLocation}}</small>
    

    
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
</section>
