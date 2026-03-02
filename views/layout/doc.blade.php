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


            @paper(['padding' => 3, 'classList' => ['u-margin__bottom--4']])
            

                @include($example['component'])

                <!-- Code blocks -->
                @code(['language' => 'html', 'content' => '', 'classList' => ['d-code', 'u-display--none'], 'attributeList' => ['js-toggle-item' => $example['html']['id'], 'js-toggle-class' => 'u-display--block', 'js-toggle-group' => $loop->index]])
                    {{ \HbgStyleGuide\Helper\ParseString::tidyHtml($example['html']['code'])}}
                @endcode
                @code(['language' => 'php', 'content' => '', 'classList' => ['d-code', 'u-display--none'], 'attributeList' => ['js-toggle-item' => $example['blade']['id'], 'js-toggle-class' => 'u-display--block', 'js-toggle-group' => $loop->index]])
                    {{$example['blade']['code']}}
                @endcode

                <!-- Toggle buttons -->
                <div class="d-code__toggle c-code__toggle">
                    @button([
                        'text' => 'HTML',
                        'color' => 'default',
                        'style' => 'basic',
                        'size' => 'sm',
                        'classList' => ['u-margin--0'],
                        'toggle' => true,
                        'attributeList' => ['js-toggle-trigger' => $example['html']['id'], 'js-toggle-group' => $loop->index]
                    ])
                    @endbutton
                    @button([
                        'text' => 'Blade',
                        'color' => 'default',
                        'style' => 'basic',
                        'size' => 'sm',
                        'classList' => ['u-margin--0'],
                        'toggle' => true,
                        'attributeList' => ['js-toggle-trigger' => $example['blade']['id'], 'js-toggle-group' => $loop->index]
                    ])
                    @endbutton
                </div>

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
                    'title'        => 'Parameters',
                    'headings'     => ['Key', 'Default value', 'Type', 'Available values', 'Description'],
                    'list'         => $paramRows,
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
</section>
