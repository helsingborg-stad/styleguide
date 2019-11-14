<section id="docblock-{{rand(0,99999)}}" class="example">
    @if($slug === 'card')

        <h3>Example</h3>
        <div class="markup-preview">
            {!! $slot !!}
        </div>
        @paper(['padding' => 3])
            <h3>HTML rendered by blade component</h3>
            @code(['language' => 'html', 'content' => ""])
            {{ \HbgStyleGuide\Helper\ParseString::tidyHtml($slot)}}
            @endcode
        @endpaper

    @else
        @paper(['padding' => 3])

            <h3>Example</h3>
            <div class="markup-preview">
                {!! $slot !!}
            </div>
            <h3>HTML rendered by blade component</h3>
            @code(['language' => 'html', 'content' => ""])
                {{ \HbgStyleGuide\Helper\ParseString::tidyHtml($slot)}}
            @endcode

        @endpaper
    @endif

    @if(isset($slug))
        @if(isset($displayParams) && !empty($displayParams))
        @paper(['padding' => 3])
            @if(!file_exists("views/pages/component/usage/".$slug.".blade.php"))
                <h3>Blade component</h3>
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