<section id="docblock-{{rand(0,99999)}}" class="example">
    @if($slug === 'card')

        <div class="markup-preview markup-preview--align-x">
            {!! $slot !!}
        </div>

        @paper(['padding' => 3])
            @typography([
                'variant' => "h3",
                'element' => "h3"
            ])
                HTML rendered by blade component
            @endtypography

            @code(['language' => 'html', 'content' => ""])
                {{ \HbgStyleGuide\Helper\ParseString::tidyHtml($slot)}}
            @endcode
        @endpaper

    @elseif(\HbgStyleGuide\Helper\Documentation::getUsageExamples($slug))
        @foreach(\HbgStyleGuide\Helper\Documentation::getUsageExamples($slug) as $key => $example)
            
            @paper(['padding' => 3])

                @typography([
                    'variant' => "h3",
                    'element' => "h3"
                ])
                    {{$example['description']['heading']}}
                @endtypography

                <div>
                    @include($example['component'])
                </div>
                <br>
            
                @typography([
                    "variant" => "caption",
                    "element" => "span"
                ])
                    {{$example['description']['text']}}
                @endtypography

                
                @typography([
                    'variant' => "h3",
                    'element' => "h3"
                ])
                    
                @endtypography
                
                @buttonGroup(['borderColor' => 'default', 'toggle' => true])
                    @button(['text' => 'HTML', 'isOutLined' =>  true, 'icon' => ['name' => 'code', 'color' => 'black', 'size' => 'md'],
                    'attributeList' => ['js-toggle-trigger' => '1', 'js-toggle-group' => $loop->index]])
                    @endbutton
                    @button(['text' => 'Blade', 'isOutLined' =>  true, 'icon' => ['name' => 'dvr', 'color' => 'black', 'size' => 'md'],
                    'attributeList' => ['js-toggle-trigger' => '2', 'js-toggle-group' => $loop->index]])
                    @endbutton
                @endbuttonGroup
                
                @paper([])
                    @code(['language' => 'html', 'content' => "", 'classList' => ['u-display--none'], 'attributeList' => ['js-toggle-item' => '1', 'js-toggle-class' => 'u-display--block', 'js-toggle-group' => $loop->index]])
                        {{ \HbgStyleGuide\Helper\ParseString::tidyHtml($example['html'])}}
                    @endcode
                @endpaper
                @paper([])
                @if(file_exists("views/pages/component/usage/".$slug.".blade.php"))
                        @code(['language' => 'html', 'content' => "", 'classList' => ['u-display--none'], 'attributeList' => ['js-toggle-item' => '2', 'js-toggle-class' => 'u-display--block', 'js-toggle-group' => $loop->index]])
                            {{$example['blade']}}
                        @endcode
                    @else
                        @code(['language' => 'html', 'content' => "", 'classList' => ['u-display--none'], 'attributeList' => ['js-toggle-item' => '2', 'js-toggle-class' => 'u-display--block lol', 'js-toggle-group' => $loop->index]])
                            {{"@"}}{{$slug}}{{"([])"}}

                            {{"@end"}}{{$slug}}
                        @endcode 
                    @endif
                @endpaper

            @endpaper
        @endforeach 
    @else
        @paper(['padding' => 3])

            <div class="markup-preview">
                {!! $slot !!}
            </div>

            @typography([
                'variant' => "h3",
                'element' => "h3"
            ])
                HTML rendered by blade component
            @endtypography

            @code(['language' => 'html', 'content' => ""])
                {{ \HbgStyleGuide\Helper\ParseString::tidyHtml($slot)}}
            @endcode

        @endpaper
    @endif

    @if(isset($slug))
        @if(isset($displayParams) && !empty($displayParams))
        @paper(['padding' => 3])
            @if(!file_exists("views/pages/component/usage/".$slug.".blade.php"))

                    @typography([
                        'variant' => "h3",
                        'element' => "h3"
                    ])
                    Blade component
                    @endtypography
                <pre><code>{{"@"}}{{$slug}}{{"['parameter' => 'value']"}}

                <?php echo '@slot("parameter")'; ?>

                    Value
                <?php echo '@endslot'; ?>


                {{'$slot'}}

                {{"@end"}}{{$slug}}</code></pre>
            @endif
           @if(file_exists("views/pages/component/usage/".$slug.".blade.php"))
                <h3>Example usage in blade file</h3>
                @code(['language' => 'scss', 'content' => ""])
                        @php ob_start(); @endphp
                        @verbatim
                            <?php include_once "views/pages/component/usage/".$slug.".blade.php";  ?>
                        @endverbatim
                        @php
                            $markup = ob_get_contents();
                            ob_end_clean();
                            echo htmlentities($markup);
                        @endphp
                @endcode
            @endif
        @endpaper
        @endif
    @endif

    @if(isset($settings) && isset($slug) && !empty($slug))
        @if(isset($displayParams) && !empty($displayParams))
        @paper(['padding' => 3])
            <h3>Blade component parameters</h3>
            <table>
                <thead>
                    <td>Key</td>
                    <td>Default value</td>
                    <td>Type</td>
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
                    <td>The DOM id of the component, will be autogenerated based on a hash of the data object.</td>
                </tr>

                <!-- Class list -->
                <tr>
                    <td>classList</td>
                    <td>[]</td>
                    <td>array</td>
                    <td>Array containing wrapping classes array</td>
                </tr>

                <!-- Attribute list -->
                <tr>
                    <td>attributeList</td>
                    <td>[]</td>
                    <td>array</td>
                    <td>Array containing keys and values rendered as attributes</td>
                </tr>

            </table>
        @endpaper
        <small><strong>Settings location:</strong> {{$settingsLocation}}</small>
        @endif
    @endif
</section>