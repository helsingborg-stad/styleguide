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

                    <div class="u-padding--4 u-color__bg--lightest" style="border: 2px dashed var(--color-code-button,var(--color-default-darker,#3d3d3d)); border-bottom: none;">
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
            <div class="d-params u-overflow--auto u-margin__top--10">
                <h3>Blade component parameters</h3>
                <table>
                    <thead>
                        <td>Key</td>
                        <td>Default value</td>
                        <td>Type</td>
                        <td>Available values</td>
                        <td>Description</td>
                    </thead>
                    @foreach($settings as $key => $item)
                        <tr>
                            <td>{{$key}}</td>

                            @if(is_array($item)||is_object($item))
                                <td>{{json_encode($item)}}</td>
                            @elseif(is_bool($item))
                                <td>{{$item ? 'true' : 'false'}}</td>
                            @else
                                <td>{{$item}}</td>
                            @endif

                            <td>{{gettype($item)}}</td>

                            @if(isset($available[$key]))
                                <td>{{$available[$key]}}</td>
                            @else
                                <td>-</td>
                            @endif

                            @if(isset($description[$key]))
                                <td>{{$description[$key]}}</td>
                            @else
                                <td>-</td>
                            @endif
                        </tr>
                    @endforeach

                    <!-- Class list -->
                    <tr>
                        <td>id</td>
                        <td></td>
                        <td>string</td>
                        <td>-</td>
                        <td>The DOM id of the component.</td>
                    </tr>

                    <!-- Class list -->
                    <tr>
                        <td>classList</td>
                        <td>[]</td>
                        <td>array</td>
                        <td>-</td>
                        <td>Array containing wrapping classes array</td>
                    </tr>

                    <!-- Attribute list -->
                    <tr>
                        <td>attributeList</td>
                        <td>[]</td>
                        <td>array</td>
                        <td>-</td>
                        <td>Array containing keys and values rendered as attributes</td>
                    </tr>

                    <!-- Container awareness -->
                    <tr>
                        <td>containerAware</td>
                        <td>false</td>
                        <td>boolean</td>
                        <td>true/false</td>
                        <td>Makes the component container aware. Appends modifiers --size--xs/sm/md/lg to the component.</td>
                    </tr>

                </table>
            </div>
            <small><strong>Settings location:</strong> {{$settingsLocation}}</small>
        @endif
    @endif
    
    @if(isset($modifiers) && !empty($modifiers))
            <div class="d-params u-overflow--auto u-margin__top--10">
                <h3>Modifiers</h3>
                <p>Modifiers can be appended to the base class and should, when needed, be added to the classList.</p>
                
                @if(isset($modifiersExample))
                    <p>Example usage: <p>
                    @code(['heading' => 'Example', 'language' => 'php', 'content' => ""]) {{$modifiersExample}} @endcode
                @endif
                
                <p id="modifiers-table-label">Available modifiers for the {{$slug}} component.</p>
                <table aria-labelledby="modifiers-table-label">
                    <thead>
                        <th>Modifier</th>
                        <th>Description</th>
                    </thead>
                    @foreach($modifiers as $key => $item)
                        <tr>
                            <td>{{$key}}</td>
                            <td>{{$item}}</td>
                        </tr>
                    @endforeach

                </table>
            </div>
    @endif

</section>