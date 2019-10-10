<section id="docblock-{{rand(0,99999)}}" class="example">

    @paper(['padding' => 3])
    
    <h3>Example</h3>
        <div class="markup-preview">
            {!! $slot !!}
        </div>
      

    @endpaper
    @if(isset($settings) && isset($slug) && !empty($slug))

        @paper(['padding' => 3])
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
        @endpaper

    @endif
</section>