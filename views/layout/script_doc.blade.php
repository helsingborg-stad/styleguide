<section id="docblock-{{rand(0,99999)}}" class="example">

    @if (strlen($slot) > 0)
        @paper(['padding' => 3])
            <h3>Example</h3>
            <div class="markup-preview">
                {!! $slot !!}
            </div>

            @buttonGroup(['borderColor' => 'default', 'classList' => ['d-code__toggle', 'c-code__toggle']])
                @button([
                    'text' => 'HTML',
                    'color' => 'default',
                    'type' => 'basic',
                    'size' => 'md',
                    'icon' => 'code',
                    'toggle' => true,
                    'attributeList' => ['js-toggle-trigger' => '0809417221', 'js-toggle-group' => '0809417221']
                ])
                @endbutton
            @endbuttonGroup

            @code(['language' => 'html', 'content' => "", 'classList' => ['d-code', 'u-display--none'], 'attributeList' => ['js-toggle-item' => '0809417221', 'js-toggle-class' => 'u-display--block', 'js-toggle-group' => '0809417221']]) 
                {{ \HbgStyleGuide\Helper\ParseString::tidyHtml($slot)}}
            @endcode
        @endpaper
    @endif

    @if(isset($settings))
        @paper(['padding' => 3])
            <h3>Attributes</h3>

            @if ($summary)
                <p>{!! $summary !!}</p>
            @endif

            <div class="d-params u-overflow--auto u-margin__top--10">
                <h3>Blade component parameters</h3>
                <table>
                    <thead>
                        <td>Attributes</td>
                        <td>Description</td>
                        <td>Values</td>
                    </thead>

                    @foreach($settings as $key => $item)

                        <tr>
                            <td>{{$key}}</td>

                            @if(isset($description[$key]))
                            <td><code>{{$description[$key]}}</code></td>
                            @else 
                            <td>-</td>
                            @endif
                            
                            @if(isset($item)) 
                                <td>{{$item}}</td>
                            @else 
                                <td>-</td>
                            @endif
                        </tr>
                    @endforeach
                </table>
            </div>
        @endpaper
    @endif
</section>