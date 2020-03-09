<section id="docblock-{{rand(0,99999)}}" class="example">

    @if(isset($summary))
        @paper(['padding' => 3])
            <h3>Summary</h3>
            <p>
                {!! $summary !!}
            </p>
        @endpaper
    @endif

    @if (strlen($slot) > 0)
        @paper(['padding' => 3])
            <h3>Example</h3>
            <div class="markup-preview">
                {!! $slot !!}
            </div>
        @endpaper
    @endif

    @if(isset($settings))
        <div class="d-params u-margin__top--10">
            <h3>Classes</h3>

            @if ($format)
                <p>Format: <code>{{ $format }}</code></p>
            @endif

            @if ($responsive && $format)
                <p>This utlitiy is responsive and can be used like <code>class="{{ $format }}@md"</code></p>
            @endif

            <table>
                <thead>
                    <td>Modifiers</td>
                    <td>Description</td>
                    <td>Values</td>
                </thead>

                @foreach($settings as $key => $item)
                    <tr>
                        <td>{{$key}}</td>

                        @if(isset($description[$key]))
                        <td>{{$description[$key]}}</td>
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
    @endif
</section>