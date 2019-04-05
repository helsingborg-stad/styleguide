<?php
    
?>
<section id="docblock-{{rand(0,99999)}}" class="example">
    <h3>Example</h3>
    <div class="markup-preview">
        {!! $markup !!}
    </div>
    <pre><code>{{ \HbgStyleGuide\Helper\ParseString::tidyHtml($markup)}}</code></pre>

    @if($settings)
    <h3>Component settings</h3>
    <table>
        @foreach($settings as $key => $item)
            <tr>
                <td>{{$key}}</td>
                @if(is_array($item)||is_object($item)) 
                <td>{{json_encode($item)}}</td>
                @else
                <td>{{$item}}</td>
                @endif
            </tr>
        @endforeach
    </table>
    @endif
</section>