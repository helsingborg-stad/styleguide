<section id="docblock-{{rand(0,99999)}}" class="example">

    @paper(['padding' => 3])
    
        <h3>Example</h3>
        <div class="markup-preview">
            {!! $slot !!}
        </div>
        @code(['language' => 'html', 'content' => ""]) 
            {{ \HbgStyleGuide\Helper\ParseString::tidyHtml($slot)}}
        @endcode

    @endpaper

    @if(isset($slug))
        @paper(['padding' => 3])
        <h3>Blade component</h3>
        <pre><code>{{"@"}}{{$slug}}{{"['parameter' => 'value']"}}

        <?php echo '@slot("parameter")'; ?>

            Value
        <?php echo '@endslot'; ?>


        {{'$slot'}}

    {{"@end"}}{{$slug}}</code></pre>
        @endpaper
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