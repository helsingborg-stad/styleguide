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
            @if ($responsive)
             <p>This utlitiy is also responsive and can be used like <code>class="u-border--left--1@md"</code></p>
             @endif
            <table>
                <thead>
                    <td>Class</td>
                    <td>Description</td>
                </thead>
                @foreach($settings as $item)
                    <tr>
                        <td>{{$item}}</td>

                        @if(isset($description[$item]))
                        <td>{{$description[$item]}}</td>
                        @else 
                        <td>-</td>
                        @endif
                    </tr>
                @endforeach
            </table>
        @endpaper

    @endif
</section>